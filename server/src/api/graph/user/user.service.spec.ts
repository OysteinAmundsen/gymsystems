import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './user.model';
import { PubSub } from 'graphql-subscriptions';
import { ClubService } from '../club/club.service';
import { Club } from '../club/club.model';
import { HttpModule } from '@nestjs/common';

export class UserRepository extends Repository<User> { }
export class ClubRepository extends Repository<Club> { }

describe('UserService', () => {
  let service: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        UserService,
        ClubService,
        { provide: 'UserRepository', useClass: UserRepository },
        { provide: 'ClubRepository', useClass: ClubRepository },
        { provide: 'PubSubInstance', useValue: new PubSub() }
      ],
    }).compile();
    service = module.get<UserService>(UserService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
