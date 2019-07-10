import { Injectable, BadRequestException, ForbiddenException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';

import { User, Role, RoleNames } from './user.model';
import { Club } from '../club/club.model';
import { ClubService } from '../club/club.service';
import { PubSub } from 'graphql-subscriptions';
import { UserDto } from './dto/user.dto';
import { RequestContext } from '../../common/middleware/request-context.model';
import { Log } from '../../common/util/logger/log';
import { template } from 'lodash';
import { plainToClass } from 'class-transformer';

const messages = {
  created: `<h1>Welcome!</h1>
<p>You are receiving this email because you have just been registerred as a user with role "<%=roleName %>",
a representative of "<%=club %>", on <a href="gymsystems.no">GymSystems</a>.</p>
<p>You can <a href="gymsystems.no/login">log in</a> using <b><%=name %></b>/<b><%=password %></b>.`,

  passwordUpdate: `<h1>Your password is updated</h1>
<p>You are receiving this email because your password on <a href="gymsystems.no">GymSystems</a> has just changed.</p>
<p>Your new credentials are <b><%=name %></b>/<b><%=password %></b>`
};

const emailFrom = 'no-reply@gymsystems.no';

@Injectable()
export class UserService {
  sendmail = require('sendmail')({
    logger: Log.log,
    silent: false
  });

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject('PubSubInstance') private readonly pubSub: PubSub,
    private readonly clubService: ClubService
  ) { }

  /**
   * Utility function to create a random uid
   */
  makeId(len: number) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < len; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }


  /**
   * Hash up password
   */
  createPasswordHash(password: string) {
    return hashSync(password, genSaltSync(8));
  }

  /**
   * Utility function to validate a password against a user
   */
  isPasswordCorrect(user: User, password: string): boolean {
    return compareSync(password, user.password);
  }

  /**
   *
   */
  findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email: email }, relations: ['club'] });
  }

  /**
   *
   */
  findOneByUsername(userName: string): Promise<User> {
    return this.userRepository.findOne({ where: { name: userName }, relations: ['club'] });
  }

  /**
   *
   */
  async findOneById(id: number): Promise<User> {
    // const me = this.getAuthenticatedUser();
    const user = await this.userRepository.findOne({ where: { id: id }, relations: ['club'] });
    // if (me.role < Role.Admin && me.clubId !== user.clubId) {
    //   throw new ForbiddenException();
    // }
    return user;
  }

  /**
   *
   */
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   *
   */
  findByClubId(id: number): Promise<User[]> {
    return this.userRepository.find({
      where: { clubId: id }
    });
  }

  /**
   *
   */
  findByClub(club: Club): Promise<User[]> {
    return this.findByClubId(club.id);
  }

  /**
   * Change a password. Can only be run against currently authenticated user.
   */
  async changePassword(user: User, password: string): Promise<boolean> {
    // TODO: Create some password validation here perhaps?
    const origPass = password;
    Log.log.info(`Changing password for user ${user.id}: "${origPass}"`)
    password = this.createPasswordHash(password);
    const res = await this.userRepository.update({ id: user.id }, { password: password });
    // Notify by email
    this.sendmail({
      from: emailFrom, to: user.email, subject: 'Your password is changed',
      html: template(messages.passwordUpdate)({ name: user.name, password: origPass }),
    }, (err: any, reply: any) => {
      Log.log.debug(err && err.stack);
      Log.log.debug(reply);
    });
    return true;
  }

  /**
   * Either create a new user, or modify an existing.
   *
   */
  async save(user: UserDto): Promise<User> {
    // TODO: Implement logic preventing users from elevating their role
    // TODO: Implement logic preventing users from changing usernames
    // TODO: Implement logic preventing users from overwriting other users by giving another ID
    // TODO: Implement logic to encrypt password if passed through the UserDTO
    const me = this.getAuthenticatedUser();
    const origPass = user.password;
    if (!user.id) {
      // Create new user
      // Check requested authorization level
      if (user.role > Role.Club) {
        if (me) {
          // The registration is for a user with privileges in the system.
          if (me.role < Role.Club) {
            throw new ForbiddenException('You do not have privileges to create other users in the system. Ask a club representative.');
          }
          if (me.role < user.role) {
            throw new ForbiddenException('Cannot create a user with higher privileges than yourself!');
          }
        } else if (user.role !== Role.Organizer) {
          // Request is for a high privileged user, with no authorization. Prevent!
          throw new ForbiddenException('Illegal request for high privileged user. You need to be authorized for this action.');
        }
      }

      // Check password
      if (!user.password) {
        throw new ForbiddenException('Password cannot be empty');
      }
      user.password = this.createPasswordHash(origPass);

      // Validate and sanitize user data
      if (await this.findOneByUsername(user.name)) {
        throw new BadRequestException('Username is taken');
      }
      if (await this.findOneByEmail(user.email)) {
        throw new BadRequestException('Email is allready used');
      }

      // Validate club
      if (user.clubId || (user.club && user.club.id)) {
        const club = await this.clubService.findOneById(user.clubId || user.club.id);
        if (!club) { throw new BadRequestException('A Club is required'); }
      } else if (typeof user.club === 'string') {
        try {
          user.club = await this.clubService.findOrCreateClub(user.club);
        } catch (ex) {
          throw new BadRequestException(ex.message);
        }
      } else if (user.role < Role.Admin) {
        throw new BadRequestException('A Club is required');
      }
    } else {
      const entity = await this.userRepository.findOne({ where: { id: user.id } });
      user = Object.assign(entity, user);
    }

    // Persist data
    const result = await this.userRepository.save(plainToClass(User, user));
    if (result) {
      if (user.id) {
        this.pubSub.publish('userModified', { user: result });
      } else {
        this.pubSub.publish('userCreated', { user: result });
        // Notify by email
        this.sendmail({
          from: emailFrom, to: user.email, subject: 'You are registerred',
          html: template(messages.created)({
            name: user.name,
            password: origPass,
            roleName: RoleNames.find(r => r.id === user.role).name,
            club: user.club ? user.club.name : 'No club'
          }),
        }, (err: any, reply: any) => {
          Log.log.debug(err && err.stack);
          Log.log.debug(reply);
        });
      }
    }
    delete result.club;
    delete result.tournaments;
    delete result.venues;

    return result;
  }

  /**
   *
   */
  async remove(id: number) {
    const me = this.getAuthenticatedUser();
    if (me.id === id) {
      throw new ForbiddenException('You cannot delete yourself!');
    }

    const result = await this.userRepository.delete({ id: id });
    if (result.raw.affectedRows > 0) {
      this.pubSub.publish('userDeleted', { userDeleted: id });
    }
    return result.raw.affectedRows > 0;
  }

  /**
   *
   */
  getAuthenticatedUser(): User {
    return RequestContext.currentUser();
  }
}
