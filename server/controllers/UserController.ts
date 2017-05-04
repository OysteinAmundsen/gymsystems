import { getConnectionManager, Connection, Repository } from 'typeorm';
import { Body, Delete, EmptyResultCode, Get, JsonController, Param, Post, Put, Req, Res, UseBefore } from 'routing-controllers';
import { Container, Service } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;
import * as auth from 'passport';

import { RequireAuth, RequireRoleAdmin, RequireRoleOrganizer } from '../middlewares/RequireAuth';
import { Logger } from '../utils/Logger';
import { User, Role, RoleNames } from '../model/User';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { ClubController } from "./ClubController";
import { Club } from "../model/Club";

const messages = {
  created: `
<h1>Welcome!</h1>
<p>You are receiving this email because you have just been registerred as a user on <a href="www.gymsystems.org">GymSystems</a> as "<%=roleName %>"}</p>
<p>Please log in to <a href="www.gymsystems.org/login">www.gymsystems.org</a> using <b><%=name %></b>/<b><%=password %></b>`,
  clubCreated: `
<h1>Welcome!</h1>
<p>You are receiving this email because you have just been registerred as a user on <a href="www.gymsystems.org">GymSystems</a> as a representative of "<%=club %>"}</p>
<p>Please log in to <a href="www.gymsystems.org/login">www.gymsystems.org</a> using <b><%=name %></b>/<b><%=password %></b>`,
  passwordUpdate: `
<h1>Your password is updated</h1>
<p>You are receiving this email because your password on <a href="www.gymsystems.org">GymSystems</a> has just changed.</p>
<p>Your new credentials are <b><%=name %></b>/<b><%=password %></b>`
}

const emailFrom = 'no-reply@gymsystems.org';

/**
 *
 */
@Service()
@JsonController('/users')
export class UserController {
  private repository: Repository<User>;
  private conn: Connection;

  sendmail = require('sendmail')({
    logger: Logger.log,
    silent: false
  });

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

        req.logIn(user, async (err: any) => {
          if (err) { return reject({httpCode: 401, message: err}); }
          let returnedUser = await this.me(req);
          if (!returnedUser) { returnedUser = user; }
          return resolve(returnedUser);
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
  @UseBefore(RequireRoleOrganizer)
  async all(@Req() req: Request): Promise<User[]> {
    const me = await this.me(req);

    const query = this.repository.createQueryBuilder('user');
    if (me.role < Role.Admin) {
      // Limit to show users in my own club only
      query.where('user.club=:clubId', {clubId: me.club.id});
    }
    return query.getMany();
  }

  @EmptyResultCode(204)
  @Get('/me')
  me( @Req() req: Request): Promise<User> {
    if (req.session && req.session.passport && req.session.passport.user) {
      return this.get(req.session.passport.user.id, req);
    }
    return null;
  }

  @UseBefore(RequireAuth)
  @EmptyResultCode(404)
  @Get('/get/:id')
  get( @Param('id') userId: number, @Req() req: Request): Promise<User> {
      return this.repository.createQueryBuilder('user')
        .where('user.id=:id', {id: userId})
        .leftJoinAndSelect('user.club', 'club')
        .getOne();
  }

  async checkClub(user: User, res: Response) {
    const clubRepository = Container.get(ClubController);
    if (typeof user.club === 'string') {
      const club: Club[] = await clubRepository.all(null, user.club);
      if (club.length === 1) {
        user.club = club[0];
      } else {
        return false;
      }
    }
    return user;
  }

  @Put('/:id')
  @UseBefore(RequireAuth)
  update( @Param('id') id: number, @Body() user: any, @Res() res: Response) {
    // Make sure club is an object
    if (!this.checkClub(user, res)) {
      res.status(400);
      return {code: 400, message: 'Club name given has no unique match'};
    }
    if (user.password) {
      // Password is updated. Encrypt and store entire user object
      const setPassword = user.password;
      user.password = bcrypt.hashSync(setPassword, bcrypt.genSaltSync(8));
      return this.repository.persist(user)
        .then(persisted => {
          // Password is updated. Notify user by email
          this.sendmail({ from: emailFrom, to: user.email, subject: 'Your password is changed',
            html: _.template(messages.passwordUpdate)({name: user.name, password: setPassword}),
          }, (err: any, reply: any) => {
            Logger.log.debug(err && err.stack);
            Logger.log.debug(reply);
          });
          return persisted;
        })
        .catch(err => Logger.log.error(err));
    }
    return this.repository.findOneById(id).then((u: any) => {
      // Overwrite all given properties, except password
      Object.keys(user).forEach((k: string) => {
        if (k !== 'password') {
          u[k] = user[k];
        }
      });
      return this.repository.persist(u).catch(err => Logger.log.error(err));
    });
  }

  @Post()
  @UseBefore(RequireRoleOrganizer)
  async create( @Body() user: User, @Req() req: Request, @Res() res: Response): Promise<User[] | any> {
    const users = Array.isArray(user) ? user : [user];

    // Make sure club is an object
    for (let j = 0; j < users.length; j++) {
      if (!this.checkClub(users[j], res)) {
        res.status(400);
        return {code: 400, message: 'Club name given has no unique match'};
      }
    }

    const me = await this.me(req);
    if (me.role < Role.Admin) {
      if (users.some(u => u.club.id !== me.club.id)) {
        res.status(403);
        return { code: 403, message: 'You are not authorized to create users in other clubs than your own.' };
      }
      if (users.some(u => u.role > me.role)) {
        res.status(403);
        return { code: 403, message: 'Your are not authorized to create users with higher privileges than your own.'}
      }
    }

    // Hash up passwords
    users.forEach((u: any) => u['origPass'] = u.password);
    users.forEach((u: any) => u.password = bcrypt.hashSync(u.password, bcrypt.genSaltSync(8)));

    // Create users
    return this.repository.persist(users)
      .then(persisted => {
        persisted.forEach(user => {
          // Send email confirmation on user creation and login details
          const u: any = users.find(u => u.name === user.name);
          const roleName = RoleNames.find(r => r.id === u.role);
          this.sendmail({ from: emailFrom, to: user.email, subject: 'You are registerred',
            html: _.template(messages.created)({name: user.name, password: u['origPass'], roleName: roleName.name}),
          }, (err: any, reply: any) => {
            Logger.log.debug(err && err.stack);
            Logger.log.debug(reply);
          });
        });
        return persisted;
      })
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }

  @Post('/register')
  selfService(@Body() user: User, @Res() res: Response) {
    // Only clubs and Organizers are allowed to use this
    if (user.role !== Role.Organizer && user.role !== Role.Club) {
      user.role = Role.Club;
    }
    const origPass = user.password;
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));
    return this.repository.persist(user)
      .then(persisted => {
        // Send email confirmation on user creation and login details
        const roleName = RoleNames.find(r => r.id === user.role);
        this.sendmail({ from: emailFrom, to: user.email, subject: 'You are registerred',
          html: _.template(messages.clubCreated)({name: user.name, password: origPass, club: user.club}),
        }, (err: any, reply: any) => {
          Logger.log.debug(err && err.stack);
          Logger.log.debug(reply);
        });
        return persisted;
      })
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }

  @Delete('/:id')
  @UseBefore(RequireRoleOrganizer)
  async remove( @Param('id') userId: number, @Req() req: Request, @Res() res: Response) {
    const me = await this.me(req);
    const user = await this.repository.findOneById(userId);
    if (me.role < Role.Admin) {
      if (me.club.id !== user.club.id) {
        res.status(403);
        return { code: 403, message: 'You are not authorized to remove users from other clubs than your own.'};
      }
    }
    return this.repository.remove(user)
      .catch(err => Logger.log.error(err));
  }
}
