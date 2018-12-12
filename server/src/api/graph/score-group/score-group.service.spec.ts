import { Test, TestingModule } from '@nestjs/testing';
import { ScoreGroupService } from './score-group.service';

describe('ScoreGroupService', () => {
  let service: ScoreGroupService;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScoreGroupService],
    }).compile();
    service = module.get<ScoreGroupService>(ScoreGroupService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
