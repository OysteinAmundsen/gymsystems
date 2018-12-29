import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { Repository } from 'typeorm';
import { TeamInDiscipline } from './team-in-discipline.model';
import { PubSub } from 'graphql-subscriptions';
import { UserService } from '../user/user.service';
import { ClubService } from '../club/club.service';
import { User } from '../user/user.model';
import { Club } from '../club/club.model';
import { HttpModule } from '@nestjs/common';
import { ScoreService } from '../score/score.service';
import { ScoreGroupService } from '../score-group/score-group.service';
import { Score } from '../score/score.model';
import { ScoreGroup } from '../score-group/score-group.model';

export class TeamInDisciplineRepository extends Repository<TeamInDiscipline> { }
export class UserRepository extends Repository<User> { }
export class ClubRepository extends Repository<Club> { }
export class ScoreRepository extends Repository<Score> { }
export class ScoreGroupRepository extends Repository<ScoreGroup> { }

describe('ScheduleService', () => {
  let service: ScheduleService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        UserService,
        ClubService,
        ScoreService,
        ScheduleService,
        ScoreGroupService,
        { provide: 'ScoreRepository', useClass: ScoreRepository },
        { provide: 'ScoreGroupRepository', useClass: ScoreGroupRepository },
        { provide: 'UserRepository', useClass: UserRepository },
        { provide: 'ClubRepository', useClass: ClubRepository },
        { provide: 'TeamInDisciplineRepository', useClass: TeamInDisciplineRepository },
        { provide: 'PubSubInstance', useValue: new PubSub() }
      ],
    }).compile();
    service = module.get<ScheduleService>(ScheduleService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
