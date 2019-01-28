import { Injectable, BadRequestException, ForbiddenException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';

import { Config } from '../../common/config';
import { User, Role } from './user.model';
import { Club } from '../club/club.model';
import { ClubService } from '../club/club.service';
import { PubSub } from 'graphql-subscriptions';
import { UserDto } from './dto/user.dto';
import { RequestContext } from '../../common/middleware/request-context.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject('PubSubInstance') private readonly pubSub: PubSub,
    private readonly clubService: ClubService
  ) { }

  /**
   * Hash up password
   */
  createPasswordHash(password: string) {
    return hashSync(password, genSaltSync(8));
  }

  isPasswordCorrect(user: User, password: string): boolean {
    return compareSync(password, user.password);
  }

  findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email: email }, relations: ['club'] });
  }

  findOneByUsername(userName: string): Promise<User> {
    return this.userRepository.findOne({ where: { name: userName }, relations: ['club'] });
  }

  async findOneById(id: number): Promise<User> {
    // const me = this.getAuthenticatedUser();
    const user = await this.userRepository.findOne({ where: { id: id }, relations: ['club'] });
    // if (me.role < Role.Admin && me.clubId !== user.clubId) {
    //   throw new ForbiddenException();
    // }
    return user;
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findByClubId(id: number): Promise<User[]> {
    return this.userRepository.find({
      where: { clubId: id },
      cache: Config.QueryCache
    });
  }
  findByClub(club: Club): Promise<User[]> {
    return this.findByClubId(club.id);
  }

  async changePassword(password: string): Promise<boolean> {
    // TODO: Create some password validation here perhaps?
    const me = this.getAuthenticatedUser();
    if (!me) { throw new ForbiddenException('You must log on to change password'); }
    password = this.createPasswordHash(password);
    return this.userRepository.update({ id: me.id }, { password: password })
      .then(res => true);
  }

  async save(user: UserDto): Promise<User> {
    // TODO: Implement logic preventing users from elevating their role
    // TODO: Implement logic preventing users from changing usernames
    // TODO: Implement logic preventing users from overwriting other users by giving another ID
    // TODO: Implement logic to encrypt password if passed through the UserDTO
    const me = this.getAuthenticatedUser();
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

      // Validate and sanitize user data
      delete user.password;
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
      const entity = await this.findOneById(user.id);
      user = Object.assign(entity, user);
    }

    // Persist data
    const result = await this.userRepository.save(<User>user);
    if (result) {
      this.pubSub.publish(user.id ? 'userModified' : 'userCreated', { user: result });
    }
    return result;
  }

  async remove(id: number) {
    const me = this.getAuthenticatedUser();
    if (me.id === id) {
      throw new ForbiddenException('You cannot delete yourself!');
    }

    const result = await this.userRepository.delete({ id: id });
    if (result.affected > 0) {
      this.pubSub.publish('userDeleted', { userDeleted: id });
    }
    return result.affected > 0;
  }

  getAuthenticatedUser(): User {
    return RequestContext.currentUser();
  }
}
