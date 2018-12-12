import { Test, TestingModule } from '@nestjs/testing';
import { VenueService } from './venue.service';

describe('VenueService', () => {
  let service: VenueService;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VenueService],
    }).compile();
    service = module.get<VenueService>(VenueService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
