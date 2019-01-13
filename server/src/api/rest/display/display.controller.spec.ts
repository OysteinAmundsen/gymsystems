import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from "typeorm";
import { ConfigurationService } from "../administration/configuration.service";
import { TournamentService } from "../../graph/tournament/tournament.service";
import { ScoreService } from "../../graph/score/score.service";
import { DisplayController } from "./display.controller";
import { TeamInDiscipline } from '../../graph/schedule/team-in-discipline.model';

export class TeamInDisciplineRepository extends Repository<TeamInDiscipline> { }

describe("DisplayController", () => {
  let testModule: TestingModule;
  let controller: DisplayController;

  beforeAll(async () => {
    const configurationServiceStub = { getOneById: () => ({ value: {} }) };
    const tournamentServiceStub = { findOneById: () => ({}) };
    const scoreServiceStub = { getTotalScore: () => ({ then: () => ({}) }) };

    testModule = await Test.createTestingModule({
      providers: [
        DisplayController,
        { provide: 'TeamInDisciplineRepository', useClass: TeamInDisciplineRepository },
        { provide: ConfigurationService, useValue: configurationServiceStub },
        { provide: TournamentService, useValue: tournamentServiceStub },
        { provide: ScoreService, useValue: scoreServiceStub }
      ]
    }).compile();
    controller = testModule.get<DisplayController>(DisplayController);
  });
  it("can load instance", () => {
    expect(controller).toBeTruthy();
  });
});
