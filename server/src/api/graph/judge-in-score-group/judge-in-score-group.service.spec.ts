import { Test, TestingModule } from '@nestjs/testing';
import { JudgeInScoreGroupService } from './judge-in-score-group.service';
import { Repository } from 'typeorm';
import { JudgeInScoreGroup } from './judge-in-score-group.model';
import { PubSub } from 'graphql-subscriptions';

export class JudgeInScoreGroupRepository extends Repository<JudgeInScoreGroup> { }

describe('JudgeInScoreGroupService', () => {
  let service: JudgeInScoreGroupService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JudgeInScoreGroupService,
        { provide: 'JudgeInScoreGroupRepository', useClass: JudgeInScoreGroupRepository },
        { provide: 'PubSubInstance', useValue: new PubSub() }
      ],
    }).compile();
    service = module.get<JudgeInScoreGroupService>(JudgeInScoreGroupService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
