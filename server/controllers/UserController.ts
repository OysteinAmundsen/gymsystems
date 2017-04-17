import { getConnectionManager, Connection, Repository } from 'typeorm';
import { Body, Delete, EmptyResultCode, Get, JsonController, Param, Post, Put, Req, Res, UseBefore } from 'routing-controllers';
import { EntityFromParam, EntityFromBody } from 'typeorm-routing-controllers-extensions';
import { Container, Service } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;
import * as auth from 'passport';

import { RequireAuth, RequireRoleAdmin } from '../middlewares/RequireAuth';
import { Logger } from '../utils/Logger';
import { User } from '../model/User';

/**
 *
 */
@Service()
@JsonController('/users')
export class UserController {
  private repository: Repository<User>;
  private conn: Connection;

  constructor() {
    this.conn = getConnectionManager().get();
    this.repository = this.conn.getRepository(User);

  }

  // Setup REST endpoint for login
  @Post('/login')
  login(@Req() req: any, @Res() res: Response, @Body() user: any) {
    const passport = Container.get(auth.Passport);
    return new Promise((resolve, reject) => {
      passport.authenticate('local-login', { failWithError: true }, (err: any, user: User, info: any) => {
        console.log('User', JSON.stringify(err), JSON.stringify(user), JSON.stringify(info));
        if (err) { return reject({httpCode: 401, message: err}); }
        if (!user) { info.httpCode = 401; return reject(info); }

        req.logIn(user, (err: any) => {
          if (err) { return reject({httpCode: 401, message: err}); }
          return resolve(user);
        });
      })(req, res, req.next);
    });
  }

  @Get()
  @UseBefore(RequireAuth)
  all() {
    return this.repository.find();
  }

  @EmptyResultCode(404)
  @Get('/me')
  me( @Req() req: Request): Promise<User> {
    if (req.session && req.session.passport && req.session.passport.user) {
      return Promise.resolve(<User>req.session.passport.user);
    }
    return Promise.reject('Not logged in');
  }

  @UseBefore(RequireAuth)
  @EmptyResultCode(404)
  @Get('/:id')
  get( @EntityFromParam('id') user: User, @Req() req: Request): User {
    return user;
  }

  @Put('/:id')
  @UseBefore(RequireAuth)
  update( @Param('id') id: number, @EntityFromBody() user: User, @Res() res: Response) {
    Logger.log.debug('Updating user');
    return this.repository.persist(user).catch(err => Logger.log.error(err));
  }

  @Post()
  @UseBefore(RequireRoleAdmin)
  create( @EntityFromBody() user: User, @Res() res: Response) {
    if (!Array.isArray(user)) {
      Logger.log.debug('Creating one user');
      return this.repository.persist(user).catch(err => Logger.log.error(err));
    }
    return null;
  }

  @Post()
  @UseBefore(RequireRoleAdmin)
  createMany( @Body() users: User[], @Res() res: Response) {
    if (Array.isArray(users)) {
      Logger.log.debug('Creating many users');
      return this.repository.persist(users).catch(err => Logger.log.error(err));
    }
    return null;
  }

  @Delete('/:id')
  @UseBefore(RequireRoleAdmin)
  remove( @EntityFromParam('id') user: User, @Res() res: Response) {
    return this.repository.remove(user)
      .catch(err => Logger.log.error(err));
  }
}
