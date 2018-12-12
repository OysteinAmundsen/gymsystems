import { Test, TestingModule } from '@nestjs/testing';
import { JudgeInScoreGroupService } from './judge-in-score-group.service';

describe('JudgeInScoreGroupService', () => {
  let service: JudgeInScoreGroupService;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JudgeInScoreGroupService],
    }).compile();
    service = module.get<JudgeInScoreGroupService>(JudgeInScoreGroupService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
