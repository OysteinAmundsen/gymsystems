import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { Repository } from 'typeorm';
import { TeamInDiscipline } from './team-in-discipline.model';
import { PubSub } from 'graphql-subscriptions';
import { User } from '../user/user.model';
import { Club } from '../club/club.model';
import { HttpModule } from '@nestjs/common';
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
    const userService = {
      getAuthenticatedUser: () => { }
    };
    const scoreService = {
      removeAllByParticipant: () => { },
      invalidateCache: () => { }
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        ScheduleService,
        { provide: 'UserService', useValue: userService },
        { provide: 'ScoreService', useValue: scoreService },
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
