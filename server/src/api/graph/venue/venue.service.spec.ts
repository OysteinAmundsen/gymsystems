import { Test, TestingModule } from '@nestjs/testing';
import { VenueService } from './venue.service';
import { Repository } from 'typeorm';
import { Venue } from './venue.model';
import { PubSub } from 'graphql-subscriptions';
import { HttpModule } from '@nestjs/common';
import { Config } from '../../common/config';

export class VenueRepository extends Repository<Venue> { }

describe('VenueService', () => {
  let service: VenueService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        VenueService,
        Config,
        { provide: 'VenueRepository', useClass: VenueRepository },
        { provide: 'PubSubInstance', useValue: new PubSub() }
      ],
    }).compile();
    service = module.get<VenueService>(VenueService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
