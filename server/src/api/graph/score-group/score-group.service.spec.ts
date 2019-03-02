import { Test, TestingModule } from '@nestjs/testing';
import { ScoreGroupService } from './score-group.service';
import { Repository } from 'typeorm';
import { ScoreGroup } from './score-group.model';
import { PubSub } from 'graphql-subscriptions';

export class ScoreGroupRepository extends Repository<ScoreGroup> { }

describe('ScoreGroupService', () => {
  let service: ScoreGroupService;

  beforeAll(async () => {
    const judgeInScoreGroupService = {
      invalidateCache: () => { },
      removeAllFromScoreGroup: () => { }
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoreGroupService,
        { provide: 'ScoreGroupRepository', useClass: ScoreGroupRepository },
        { provide: 'JudgeInScoreGroupService', useValue: judgeInScoreGroupService },
        { provide: 'PubSubInstance', useValue: new PubSub() }
      ],
    }).compile();
    service = module.get<ScoreGroupService>(ScoreGroupService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
