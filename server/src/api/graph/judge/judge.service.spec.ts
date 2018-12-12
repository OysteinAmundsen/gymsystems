import { Test, TestingModule } from '@nestjs/testing';
import { JudgeService } from './judge.service';

describe('JudgeService', () => {
  let service: JudgeService;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JudgeService],
    }).compile();
    service = module.get<JudgeService>(JudgeService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
