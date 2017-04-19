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

  @Post('/logout')
  logout(@Req() req: any, @Res() res: Response): null {
    const passport = Container.get(auth.Passport);
    req.logOut();
    return null;
  }

  @Get()
  @UseBefore(RequireAuth)
  all() {
    return this.repository.find();
  }

  @EmptyResultCode(204)
  @Get('/me')
  me( @Req() req: Request): User {
    if (req.session && req.session.passport && req.session.passport.user) {
      return <User>req.session.passport.user;
    }
    return null;
  }

  // @UseBefore(RequireAuth)
  // @EmptyResultCode(404)
  // @Get('/:id')
  // get( @EntityFromParam('id') user: User, @Req() req: Request): User {
  //   return user;
  // }

  @Put('/:id')
  @UseBefore(RequireAuth)
  update( @Param('id') id: number, @EntityFromBody() user: User, @Res() res: Response) {
    return this.repository.persist(user).catch(err => Logger.log.error(err));
  }

  @Post()
  @UseBefore(RequireRoleAdmin)
  create( @EntityFromBody() user: User, @Res() res: Response): Promise<User[]> {
    const users = Array.isArray(user) ? user : [user];
    return this.repository.persist(users)
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }

  @Delete('/:id')
  @UseBefore(RequireRoleAdmin)
  remove( @EntityFromParam('id') user: User, @Res() res: Response) {
    return this.repository.remove(user)
      .catch(err => Logger.log.error(err));
  }
}
