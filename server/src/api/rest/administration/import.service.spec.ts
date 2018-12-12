import { Test, TestingModule } from '@nestjs/testing';
import { ImportService } from './import.service';

describe('ImportService', () => {
  let service: ImportService;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImportService],
    }).compile();
    service = module.get<ImportService>(ImportService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
