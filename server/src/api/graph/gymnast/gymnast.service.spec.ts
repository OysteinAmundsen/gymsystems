import { Test, TestingModule } from '@nestjs/testing';
import { GymnastService } from './gymnast.service';

describe('GymnastService', () => {
  let service: GymnastService;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GymnastService],
    }).compile();
    service = module.get<GymnastService>(GymnastService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
