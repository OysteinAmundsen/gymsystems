import { Test, TestingModule } from '@nestjs/testing';
import { ScoreService } from './score.service';
import { Repository } from 'typeorm';
import { Score } from './score.model';
import { PubSub } from 'graphql-subscriptions';
import { ScoreGroup } from '../score-group/score-group.model';

export class ScoreRepository extends Repository<Score> { }
export class ScoreGroupRepository extends Repository<ScoreGroup> { }

describe('ScoreService', () => {
  let service: ScoreService;

  beforeAll(async () => {
    const scoreGroupService = {
      findByDisciplineId: () => { }
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoreService,
        { provide: 'ScoreRepository', useClass: ScoreRepository },
        { provide: 'PubSubInstance', useValue: new PubSub() },
        { provide: 'ScoreGroupService', useValue: scoreGroupService },
      ],
    }).compile();
    service = module.get<ScoreService>(ScoreService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
