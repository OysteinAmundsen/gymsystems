import { getConnectionManager, Connection, Repository } from 'typeorm';
import { Body, Delete, OnUndefined, Get, JsonController, Param, Post, Put, Req, Res, UseBefore } from 'routing-controllers';
import { Container, Service } from 'typedi';
import { Request, Response } from 'express';
import * as auth from 'passport';

import { RequireAuth, RequireRole } from '../middlewares/RequireAuth';
import { Log } from '../utils/Logger';
import { User, Role, RoleNames } from '../model/User';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';

import { ClubController } from './ClubController';
import { Club, BelongsToClub } from '../model/Club';
import { validateClub } from '../validators/ClubValidator';
import { GymServer } from '../index';
import { ErrorResponse } from '../utils/ErrorResponse';

const messages = {
  created: `<h1>Welcome!</h1>
<p>You are receiving this email because you have just been registerred as a user with role "<%=roleName %>",
a representative of "<%=club %>", on <a href="www.gymsystems.org">GymSystems</a>.</p>
<p>You can <a href="www.gymsystems.org/login">log in</a> using <b><%=name %></b>/<b><%=password %></b>.`,

  passwordUpdate: `<h1>Your password is updated</h1>
<p>You are receiving this email because your password on <a href="www.gymsystems.org">GymSystems</a> has just changed.</p>
<p>Your new credentials are <b><%=name %></b>/<b><%=password %></b>`
}

const emailFrom = 'no-reply@gymsystems.org';

/**
 * RESTful controller for all things related to `User`s.
 *
 * This controller is also a service, which means you can inject it
 * anywhere in your code:
 *
 * ```
 * import { Container } from 'typedi';
 * import { UserController } from '/controllers/Usercontroller';
 *
 * var userController = Container.get(UserController);
 * ```
 */
@Service()
@JsonController('/users')
export class UserController {
  private repository: Repository<User>;
  private conn: Connection;

  sendmail = require('sendmail')({
    logger: Log.log,
    silent: false
  });

  constructor() {
    this.conn = getConnectionManager().get();
    this.repository = this.conn.getRepository(User);

  }

  /**
   * Endpoint for login
   *
   * **USAGE:**
   * POST /users/login
   *
   * @param req
   * @param res
   * @param credentials
   */
  @Post('/login')
  login( @Req() req: any, @Res() res: Response, @Body() credentials: any) {
    const passport = Container.get(auth.Passport);
    return new Promise((resolve, reject) => {
      passport.authenticate('local-login', { failWithError: true }, (err: any, user: User, info: any) => {
        if (err) { return reject({ httpCode: 401, message: err }); }
        if (!user) { return reject({ httpCode: 401, message: err || 'No user found' }); }

        req.logIn(user, async (error: any) => {
          if (error) { return reject({ httpCode: 401, message: error }); }
          const returnedUser = await this.me(req);
          return resolve(returnedUser || user);
        });
      })(req, res, req.next);
    });
  }

  /**
   * Endpoint for logout
   *
   * **USAGE:**
   * POST /users/logout
   *
   * @param req
   * @param res
   */
  @Post('/logout')
  logout( @Req() req: Request, @Res() res: Response): null {
    const passport = Container.get(auth.Passport);
    req.logOut();
    return null;
  }

  /**
   * Endpoint for retreiving all users
   *
   * This will only return users in your club, if you are not an Admin.
   * If you are an Admin, it will return all users.
   *
   * **USAGE:** (Organizer only)
   * GET /users
   *
   * @param req
   */
  @Get()
  @UseBefore(RequireRole.get(Role.Organizer))
  async all( @Req() req: Request): Promise<User[]> {
    const me = await this.me(req);

    const query = this.repository.createQueryBuilder('user');
    if (me.role < Role.Admin) {
      // Limit to show users in my own club only
      query.where('user.club=:clubId', { clubId: me.club.id });
    }
    return query
      .leftJoinAndSelect('user.club', 'club')
      .getMany();
  }

  /**
   * Endpoint for retreiving data for currently logged in user
   *
   * **USAGE:**
   * GET /users/me
   *
   * @param req
   */
  @Get('/me')
  @OnUndefined(204)
  me( @Req() req: any): Promise<User> {
    if (req.session && req.session.passport && req.session.passport.user) {
      return this.getUser(req.session.passport.user.id);
    }
    return null;
  }

  private getUser(userId: number, clubId?: number) {
    const query = this.repository.createQueryBuilder('user')
      .where('user.id=:id', { id: userId });
    if (clubId) { // Limit to show users in my own club only
      query.andWhere('user.club=:clubId', { clubId: clubId });
    }
    return query
      .leftJoinAndSelect('user.club', 'club')
      .getOne();
  }

  /**
   * Endpoint for retreiving a specific user
   *
   * **USAGE:** (Any Login)
   * GET /users/get/:id
   *
   * @param userId
   * @param req
   */
  @Get('/get/:id')
  @UseBefore(RequireAuth)
  @OnUndefined(404)
  async get( @Param('id') userId: number, @Req() req: Request): Promise<User> {
    const me = await this.me(req);

    // Limit to show users in my own club only
    const clubId = (me.role < Role.Admin) ? me.club.id : null;
    return this.getUser(userId, clubId);
  }

  /**
   * Endpoint for updating a user
   *
   * **USAGE:** (Any Login)
   * PUT /users:id
   *
   * @param id
   * @param user
   * @param res
   * @param req
   */
  @Put('/:id')
  @UseBefore(RequireAuth)
  async update( @Param('id') id: number, @Body() user: User, @Res() res: Response, @Req() req: Request) {
    const me = await this.me(req);
    const oldUser = await this.getUser(id);
    const msg = await validateClub(user, oldUser, req);
    if (msg && me.role < Role.Admin) { res.status(403); return new ErrorResponse(403, msg); }

    if (user.password) {
      // Password is updated. Encrypt and store entire user object
      const setPassword = user.password;
      user.password = bcrypt.hashSync(setPassword, bcrypt.genSaltSync(8));
      return this.repository.save(user)
        .then(persisted => {
          if (!Container.get(GymServer).isTest) {
            // We are not in test mode, Password is updated. Notify user by email
            this.sendmail({
              from: emailFrom, to: user.email, subject: 'Your password is changed',
              html: _.template(messages.passwordUpdate)({ name: user.name, password: setPassword }),
            }, (err: any, reply: any) => {
              Log.log.debug(err && err.stack);
              Log.log.debug(reply);
            });
          }
          return persisted;
        })
        .catch(err => {
          Log.log.error(`Error updating user ${id} with password/email change`, err);
          return Promise.resolve(new ErrorResponse(err.code, err.message));
        });
    }

    // Fetch original user object, and ...
    return this.getUser(id).then((u: any) => {
      // ... overwrite all given properties, !except password!
      Object.keys(user).forEach((k: string) => {
        if (k !== 'password') {
          (<any>u)[k] = (<any>user)[k];
        }
      });
      return this.repository.save(u)
        .catch(err => {
          Log.log.error(`Error updating user ${id}`, err);
          return Promise.resolve(new ErrorResponse(err.code, err.message));
        });
    });
  }

  /**
   * Endpoint for creating a user (from the users panel)
   *
   * **USAGE:** (Organizer only)
   * POST /users
   *
   * @param user
   * @param req
   * @param res
   */
  @Post()
  @UseBefore(RequireRole.get(Role.Organizer))
  async create( @Body() user: User, @Req() req: Request, @Res() res: Response): Promise<User[] | any> {
    // Clone user object
    const userCopy = JSON.parse(JSON.stringify(user));

    // Validate user role
    const me = await this.me(req);
    if (user.role > me.role && me.role < Role.Admin) {
      res.status(403);
      return new ErrorResponse(403, 'Your are not authorized to create users with higher privileges than your own.');
    }

    // Actually create the user
    return this.createUser(user, res, req);
  }

  /**
   * Endpoint for registering a new user (from the registration panel)
   *
   * **USAGE:**
   * POST /users/register
   *
   * @param user
   * @param res
   * @param req
   */
  @Post('/register')
  async selfService( @Body() user: User, @Res() res: Response, @Req() req: Request) {
    // Only clubs and Organizers are allowed to use this
    // and we are in a context where we do not have a logged in user.
    // We will therefore assume lowest role `Club` if none is given.
    if (user.role !== Role.Organizer && user.role !== Role.Club) {
      user.role = Role.Club;
    }

    return this.createUser(user, res, req);
  }

  private async createUser(user: User, res: Response, req: Request) {
    const origPass = user.password;

    const msg = await validateClub(user, null, req);
    if (msg) { res.status(403); return new ErrorResponse(403, msg); }

    // Hash up password
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));
    return this.repository.save(user)
      .then(persisted => {
        const server = Container.get(GymServer);
        // Send email confirmation on user creation and login details
        const roleName = RoleNames.find(r => r.id === user.role);
        this.sendmail({
          from: emailFrom, to: user.email, subject: 'You are registerred',
          html: _.template(messages.created)({
            name: user.name,
            password: origPass,
            roleName: roleName.name,
            club: user.club ? user.club.name : 'No club'
          }),
        }, (err: any, reply: any) => {
          Log.log.debug(err && err.stack);
          Log.log.debug(reply);
        });
        return persisted;
      })
      .catch(err => {
        if (err.code === 'ER_DUP_ENTRY') {
          res.status(403);
          return new ErrorResponse(403, 'A user with this name allready exists');
        }
        // Default response
        Log.log.error(`Error creating user`, err);
        res.status(400);
        return new ErrorResponse(err.code, err.message);
      });
  }

  /**
   * Endpoint for removing a user
   *
   * **USAGE:** (Organizer only)
   * DELETE /users:id
   *
   * @param userId
   * @param req
   * @param res
   */
  @Delete('/:id')
  @UseBefore(RequireRole.get(Role.Organizer))
  async remove( @Param('id') userId: number, @Req() req: Request, @Res() res: Response) {
    const user = await this.getUser(userId);

    const msg = await validateClub(user, null, req);
    if (msg) { res.status(403); return new ErrorResponse(403, msg); }

    return this.repository.remove(user)
      .catch(err => {
        Log.log.error(`Error removing user ${userId}`, err);
        return Promise.resolve(new ErrorResponse(err.code, err.message));
      });
  }
}
