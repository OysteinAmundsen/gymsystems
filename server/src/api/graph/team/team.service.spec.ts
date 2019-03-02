import { Test, TestingModule } from '@nestjs/testing';
import { TeamService } from './team.service';
import { Repository } from 'typeorm';
import { Team } from './team.model';
import { PubSub } from 'graphql-subscriptions';

export class TeamRepository extends Repository<Team> { }

describe('TeamService', () => {
  let service: TeamService;
  const divisionServiceStub = {
    findByTeam: () => Promise.resolve({})
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        { provide: 'TeamRepository', useClass: TeamRepository },
        { provide: 'DivisionService', useValue: divisionServiceStub },
        { provide: 'PubSubInstance', useValue: new PubSub() }
      ],
    }).compile();
    service = module.get<TeamService>(TeamService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
