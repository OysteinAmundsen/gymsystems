import { Test, TestingModule } from '@nestjs/testing';
import { DivisionService } from './division.service';

describe('DivisionService', () => {
  let service: DivisionService;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DivisionService],
    }).compile();
    service = module.get<DivisionService>(DivisionService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
