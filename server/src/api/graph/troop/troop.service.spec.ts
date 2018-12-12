import { Test, TestingModule } from '@nestjs/testing';
import { TroopService } from './troop.service';

describe('TroopService', () => {
  let service: TroopService;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TroopService],
    }).compile();
    service = module.get<TroopService>(TroopService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
