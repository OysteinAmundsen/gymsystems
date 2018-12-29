import { Test, TestingModule } from '@nestjs/testing';
import { ScoreService } from './score.service';
import { Repository } from 'typeorm';
import { Score } from './score.model';
import { PubSub } from 'graphql-subscriptions';
import { ScoreGroupService } from '../score-group/score-group.service';
import { ScoreGroup } from '../score-group/score-group.model';

export class ScoreRepository extends Repository<Score> { }
export class ScoreGroupRepository extends Repository<ScoreGroup> { }

describe('ScoreService', () => {
  let service: ScoreService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoreService,
        ScoreGroupService,
        { provide: 'ScoreRepository', useClass: ScoreRepository },
        { provide: 'ScoreGroupRepository', useClass: ScoreGroupRepository },
        { provide: 'PubSubInstance', useValue: new PubSub() }
      ],
    }).compile();
    service = module.get<ScoreService>(ScoreService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
