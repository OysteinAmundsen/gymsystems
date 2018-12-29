import { Test, TestingModule } from '@nestjs/testing';
import { PubSub } from 'graphql-subscriptions';
import { Repository } from 'typeorm';

import { DisplayController } from './display.controller';

import { TeamInDiscipline } from '../../graph/schedule/team-in-discipline.model';
import { Tournament } from '../../graph/tournament/tournament.model';
import { Configuration } from '../administration/configuration.model';
import { Score } from '../../graph/score/score.model';
import { ScoreGroup } from '../../graph/score-group/score-group.model';

import { ConfigurationService } from '../administration/configuration.service';
import { TournamentService } from '../../graph/tournament/tournament.service';
import { ScoreService } from '../../graph/score/score.service';
import { ScoreGroupService } from '../../graph/score-group/score-group.service';

export class TeamInDisciplineRepository extends Repository<TeamInDiscipline> { }
export class TournamentRepository extends Repository<Tournament> { }
export class ConfigurationRepository extends Repository<Configuration> { }
export class ScoreRepository extends Repository<Score> { }
export class ScoreGroupRepository extends Repository<ScoreGroup> { }

describe('Display Controller', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [DisplayController],
      providers: [
        ConfigurationService,
        TournamentService,
        ScoreService,
        ScoreGroupService,
        { provide: 'ScoreRepository', useClass: ScoreRepository },
        { provide: 'ScoreGroupRepository', useClass: ScoreGroupRepository },
        { provide: 'TournamentRepository', useClass: TournamentRepository },
        { provide: 'TeamInDisciplineRepository', useClass: TeamInDisciplineRepository },
        { provide: 'ConfigurationRepository', useClass: ConfigurationRepository },
        { provide: 'PubSubInstance', useValue: new PubSub() }
      ]
    }).compile();
  });
  it('should be defined', () => {
    const controller: DisplayController = module.get<DisplayController>(DisplayController);
    expect(controller).toBeDefined();
  });
});
