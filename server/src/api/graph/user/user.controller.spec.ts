import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from '../../common/auth/auth.service';
import { Repository } from 'typeorm';
import { User } from './user.model';
import { PubSub } from 'graphql-subscriptions';
import { ClubService } from '../club/club.service';
import { Club } from '../club/club.model';
import { Config } from '../../common/config';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/common';

export class UserRepository extends Repository<User> { }
export class ClubRepository extends Repository<Club> { }

describe('User Controller', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [JwtModule.register({}), HttpModule],
      controllers: [UserController],
      providers: [
        UserService,
        AuthService,
        ClubService,
        Config,
        { provide: 'UserRepository', useClass: UserRepository },
        { provide: 'ClubRepository', useClass: ClubRepository },
        { provide: 'PubSubInstance', useValue: new PubSub() }
      ]
    }).compile();
  });
  it('should be defined', () => {
    const controller: UserController = module.get<UserController>(UserController);
    expect(controller).toBeDefined();
  });
});
