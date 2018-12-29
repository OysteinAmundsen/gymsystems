import { Test, TestingModule } from '@nestjs/testing';
import { ClubService } from './club.service';
import { Repository } from 'typeorm';
import { Club } from './club.model';
import { PubSub } from 'graphql-subscriptions';
import { HttpModule } from '@nestjs/common';

export class ClubRepository extends Repository<Club> { }

describe('ClubService', () => {
  let service: ClubService;
  let testModule: TestingModule;

  beforeAll(async () => {
    testModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        ClubService,
        { provide: 'ClubRepository', useClass: ClubRepository },
        { provide: 'PubSubInstance', useValue: new PubSub() }
      ],
    }).compile();
    service = testModule.get<ClubService>(ClubService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
