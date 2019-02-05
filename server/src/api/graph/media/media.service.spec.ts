import { Test, TestingModule } from '@nestjs/testing';
import { MediaService } from './media.service';
import { Repository } from 'typeorm';
import { Media } from './media.model';
import { PubSub } from 'graphql-subscriptions';

export class MediaRepository extends Repository<Media> { }

describe('MediaService', () => {
  let service: MediaService;
  const teamServiceStub = {
    findOneByIdWithTournament: () => Promise.resolve({})
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        { provide: 'MediaRepository', useClass: MediaRepository },
        { provide: 'TeamService', useValue: teamServiceStub },
        { provide: 'PubSubInstance', useValue: new PubSub() }
      ],
    }).compile();
    service = module.get<MediaService>(MediaService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
