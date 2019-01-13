import { Test, TestingModule } from '@nestjs/testing';
import { LogService } from './log.service';

describe('LogService', () => {
  let service: LogService;

  beforeAll(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      providers: [LogService],
    }).compile();
    service = testModule.get<LogService>(LogService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
