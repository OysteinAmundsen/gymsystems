import { Test, TestingModule } from '@nestjs/testing';
import { TournamentService } from './tournament.service';
import { Repository } from 'typeorm';
import { Tournament } from './tournament.model';
import { PubSub } from 'graphql-subscriptions';

export class TournamentRepository extends Repository<Tournament> { }

describe('TournamentService', () => {
  let service: TournamentService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TournamentService,
        { provide: 'TournamentRepository', useClass: TournamentRepository },
        { provide: 'PubSubInstance', useValue: new PubSub()}
      ],
    }).compile();
    service = module.get<TournamentService>(TournamentService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
