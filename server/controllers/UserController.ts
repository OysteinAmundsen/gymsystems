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
import { Club, BelongsToClub } from "../model/Club";
import { isMyClub, validateClub } from "../validators/ClubValidator";

const messages = {
  created: `
<h1>Welcome!</h1>
<p>You are receiving this email because you have just been registerred as a user with role "<%=roleName %>", a representative of "<%=club %>", on <a href="www.gymsystems.org">GymSystems</a>.</p>
<p>You can <a href="www.gymsystems.org/login">log in</a> using <b><%=name %></b>/<b><%=password %></b>.`,
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
        if (err) { return reject({httpCode: 401, message: err}); }
        if (!user) { return reject({httpCode: 401, message: err || 'No user found'}); }

        req.logIn(user, async (err: any) => {
          if (err) { return reject({httpCode: 401, message: err}); }

          let returnedUser = await this.me(req);
          return resolve(returnedUser || user);
        });
      })(req, res, req.next);
    });
  }

  @Post('/logout')
  logout(@Req() req: Request, @Res() res: Response): null {
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
    return query
      .leftJoinAndSelect('user.club', 'club')
      .getMany();
  }

  @EmptyResultCode(204)
  @Get('/me')
  me( @Req() req: any): Promise<User> {
    if (req.session && req.session.passport && req.session.passport.user) {
      return this.getUser(req.session.passport.user.id);
    }
    return null;
  }

  private getUser(userId: number, clubId?: number) {
    const query = this.repository.createQueryBuilder('user')
      .where('user.id=:id', {id: userId});
    if (clubId) { // Limit to show users in my own club only
      query.andWhere('user.club=:clubId', {clubId: clubId});
    }
    return query
      .leftJoinAndSelect('user.club', 'club')
      .getOne();
  }

  @UseBefore(RequireAuth)
  @EmptyResultCode(404)
  @Get('/get/:id')
  async get( @Param('id') userId: number, @Req() req: Request): Promise<User> {
    const me = await this.me(req);

    // Limit to show users in my own club only
    let clubId = (me.role < Role.Admin) ? me.club.id : null;
    return this.getUser(userId, clubId);
  }

  @Put('/:id')
  @UseBefore(RequireAuth)
  async update( @Param('id') id: number, @Body() user: User, @Res() res: Response) {
    // Make sure club is an object
    const hasClub = await validateClub([<BelongsToClub>user]);
    if (!hasClub)  {
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

    // Fetch original user object, and ...
    return this.getUser(id).then((u: any) => {
      // ... overwrite all given properties, !except password!
      Object.keys(user).forEach((k: string) => {
        if (k !== 'password') {
          (<any>u)[k] = (<any>user)[k];
        }
      });
      return this.repository.persist(u).catch(err => Logger.log.error(err));
    });
  }

  @Post()
  @UseBefore(RequireRoleOrganizer)
  async create( @Body() user: User, @Req() req: Request, @Res() res: Response): Promise<User[] | any> {
    const me = await this.me(req);

    // Make sure club is an object
    const hasClub = await validateClub([user]);
    const isSameClub = await isMyClub([user], req);
    if (!hasClub)  {
      res.status(400);
      return {code: 400, message: 'Club name given has no unique match'};
    }
    if (!isSameClub) {
      res.status(403);
      return {code: 403, message: 'You are not authorized to create teams for other clubs than your own.'};
    }
    if (user.role > me.role && me.role < Role.Admin) {
      res.status(403);
      return { code: 403, message: 'Your are not authorized to create users with higher privileges than your own.'}
    }

    return this.createUser(user);
  }

  @Post('/register')
  async selfService(@Body() user: User, @Res() res: Response) {
    // Only clubs and Organizers are allowed to use this
    // and we are in a context where we do not have a logged in user.
    // We will therefore assume lowest role `Club` if none is given.
    if (user.role !== Role.Organizer && user.role !== Role.Club) {
      user.role = Role.Club;
    }

    const hasClub = await validateClub([<BelongsToClub>user]);
    if (!hasClub)  {
      res.status(400);
      return {code: 400, message: 'Club name given has no unique match'};
    }

    return this.createUser(user);
  }

  private createUser(user: User) {
    const origPass = user.password;

    // Hash up password
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));
    return this.repository.persist(user)
      .then(persisted => {
        // Send email confirmation on user creation and login details
        const roleName = RoleNames.find(r => r.id === user.role);
        this.sendmail({ from: emailFrom, to: user.email, subject: 'You are registerred',
          html: _.template(messages.created)({name: user.name, password: origPass, roleName: roleName.name, club: user.club ? user.club.name : 'No club'}),
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
    const user = await this.getUser(userId);
    const isSameClub = await isMyClub([<BelongsToClub>user], req);

    if (!isSameClub) { res.status(403); return {code: 403, message: 'You are not authorized to remove users from other clubs than your own.'}; }

    return this.repository.remove(user)
      .catch(err => Logger.log.error(err));
  }
}
