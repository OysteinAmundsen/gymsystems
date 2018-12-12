import { Test, TestingModule } from '@nestjs/testing';
import { ClubService } from './club.service';

describe('ClubService', () => {
  let service: ClubService;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClubService],
    }).compile();
    service = module.get<ClubService>(ClubService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
