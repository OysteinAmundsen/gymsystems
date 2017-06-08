import { getConnectionManager, Connection, Repository } from 'typeorm';
import { Body, Delete, OnUndefined, Get, JsonController, Param, Post, Put, Req, Res, UseBefore } from 'routing-controllers';
import { Container, Service } from 'typedi';
import { Request, Response } from 'express';
import * as auth from 'passport';

import { RequireAuth, RequireRole } from '../middlewares/RequireAuth';
import { Logger } from '../utils/Logger';
import { User, Role, RoleNames } from '../model/User';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';

import { ClubController } from './ClubController';
import { Club, BelongsToClub } from '../model/Club';
import { isMyClub, validateClub } from '../validators/ClubValidator';
import { GymServer } from '../index';

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
  @UseBefore(RequireRole.get(Role.Organizer))
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

  @OnUndefined(204)
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
  @OnUndefined(404)
  @Get('/get/:id')
  async get( @Param('id') userId: number, @Req() req: Request): Promise<User> {
    const me = await this.me(req);

    // Limit to show users in my own club only
    let clubId = (me.role < Role.Admin) ? me.club.id : null;
    return this.getUser(userId, clubId);
  }

  @Put('/:id')
  @UseBefore(RequireAuth)
  async update( @Param('id') id: number, @Body() user: User, @Res() res: Response, @Req() req: Request) {
    // Make sure club is an object
    const hasClub = await validateClub([<BelongsToClub>user], req);
    if (!hasClub)  {
      // Club name given is not registerred, try to create
      if (typeof user.club === 'string') {
        const clubRepository = Container.get(ClubController);
        user.club = await clubRepository.create(<Club>{id: null, name: user.club, teams: null, users: null}, res);
      }
      // If still no club, we should fail
      if (!user.club || !user.club.id) {
        res.status(400);
        return {code: 400, message: 'Club name given has no unique match'};
      }
    }

    if (user.password) {
      // Password is updated. Encrypt and store entire user object
      const setPassword = user.password;
      user.password = bcrypt.hashSync(setPassword, bcrypt.genSaltSync(8));
      return this.repository.persist(user)
        .then(persisted => {
          if (!Container.get(GymServer).isTest) {
            // We are not in test mode, Password is updated. Notify user by email
            this.sendmail({ from: emailFrom, to: user.email, subject: 'Your password is changed',
              html: _.template(messages.passwordUpdate)({name: user.name, password: setPassword}),
            }, (err: any, reply: any) => {
              Logger.log.debug(err && err.stack);
              Logger.log.debug(reply);
            });
          }
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
  @UseBefore(RequireRole.get(Role.Organizer))
  async create( @Body() user: User, @Req() req: Request, @Res() res: Response): Promise<User[] | any> {
    const me = await this.me(req);

    // Make sure club is an object
    const isSameClub = await isMyClub([user], req);
    if (!isSameClub) {
      res.status(403);
      return {code: 403, message: 'You are not authorized to create teams for other clubs than your own.'};
    }
    if (user.role > me.role && me.role < Role.Admin) {
      res.status(403);
      return { code: 403, message: 'Your are not authorized to create users with higher privileges than your own.'}
    }

    return this.createUser(user, res, req);
  }

  @Post('/register')
  async selfService(@Body() user: User, @Res() res: Response, @Req() req: Request) {
    // Only clubs and Organizers are allowed to use this
    // and we are in a context where we do not have a logged in user.
    // We will therefore assume lowest role `Club` if none is given.
    if (user.role !== Role.Organizer && user.role !== Role.Club) {
      user.role = Role.Club;
    }

    return this.createUser(user, res, req);
  }

  private async createUser(user: User, res: Response, req: Request) {
    const hasClub = await validateClub([<BelongsToClub>user], req);
    if (!hasClub)  {
      // Club name given is not registerred, try to create
      if (typeof user.club === 'string') {
        const clubRepository = Container.get(ClubController);
        user.club = await clubRepository.create(<Club>{id: null, name: user.club, teams: null, users: null}, res);
      }
      // If still no club, we should fail
      if (!user.club || !user.club.id) {
        res.status(400);
        return {code: 400, message: 'No Club name given, or Club name has no unique match'};
      }
    }

    const origPass = user.password;

    // Hash up password
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));
    return this.repository.persist(user)
      .then(persisted => {
        if (!Container.get(GymServer).isTest) {
          // We are not in test mode, send email confirmation on user creation and login details
          const roleName = RoleNames.find(r => r.id === user.role);
          this.sendmail({ from: emailFrom, to: user.email, subject: 'You are registerred',
            html: _.template(messages.created)({name: user.name, password: origPass, roleName: roleName.name, club: user.club ? user.club.name : 'No club'}),
          }, (err: any, reply: any) => {
            Logger.log.debug(err && err.stack);
            Logger.log.debug(reply);
          });
        }
        return persisted;
      })
      .catch(err => {
        if (err.code === 'ER_DUP_ENTRY') {
          res.status(403);
          return { code: 403, message: 'A user with this name allready exists'};
        }
        // Default response
        Logger.log.error(err);
        res.status(400);
        return { code: err.code, message: err.message };
      });
  }

  @Delete('/:id')
  @UseBefore(RequireRole.get(Role.Organizer))
  async remove( @Param('id') userId: number, @Req() req: Request, @Res() res: Response) {
    const user = await this.getUser(userId);
    const isSameClub = await isMyClub([<BelongsToClub>user], req);

    if (!isSameClub) { res.status(403); return {code: 403, message: 'You are not authorized to remove users from other clubs than your own.'}; }

    return this.repository.remove(user)
      .catch(err => Logger.log.error(err));
  }
}
