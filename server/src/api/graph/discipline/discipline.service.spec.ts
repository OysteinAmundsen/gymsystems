import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from "typeorm";
import { PubSub } from "graphql-subscriptions";
import { Tournament } from "../tournament/tournament.model";
import { DisciplineDto } from "./dto/discipline.dto";
import { Team } from "../team/team.model";
import { TeamInDiscipline } from "../schedule/team-in-discipline.model";
import { ConfigurationService } from "../../rest/administration/configuration.service";
import { ScoreGroupService } from "../score-group/score-group.service";
import { DisciplineService } from "./discipline.service";
import { Discipline } from './discipline.model';

const disciplineStub = <Discipline>{ id: {} };

export class DisciplineRepository extends Repository<Discipline> { }

describe("DisciplineService", () => {
  let service: DisciplineService;
  let testModule: TestingModule;
  const tournamentStub = <Tournament>{ id: {} };
  const teamStub = <Team>{};
  const teamInDisciplineStub = <TeamInDiscipline>{ discipline: {}, disciplineId: {} };

  beforeAll(async () => {
    const configurationServiceStub = {
      getOneById: () => ({
        value: { discipline: { map: () => ({}) }, scoreGroup: {} }
      })
    };
    const scoreGroupServiceStub = { saveAll: () => ({}) };

    testModule = await Test.createTestingModule({
      providers: [
        DisciplineService,
        { provide: 'DisciplineRepository', useClass: DisciplineRepository },
        { provide: 'PubSubInstance', useValue: new PubSub() },
        { provide: ConfigurationService, useValue: configurationServiceStub },
        { provide: ScoreGroupService, useValue: scoreGroupServiceStub }
      ]
    }).compile();
    service = testModule.get<DisciplineService>(DisciplineService);
  });

  it("can load instance", () => {
    expect(service).toBeTruthy();
  });

  it("localCache defaults to: []", () => {
    expect(service.localCache).toEqual([]);
  });

  describe("save", () => {
    it("makes expected calls", () => {
      const repositoryStub = testModule.get<DisciplineRepository>(DisciplineRepository);
      const pubSubStub: PubSub = testModule.get('PubSubInstance');
      spyOn(repositoryStub, "findOne");
      spyOn(repositoryStub, "save");
      spyOn(pubSubStub, "publish");
      service.save(disciplineStub).then(result => {
        expect(repositoryStub.findOne).toHaveBeenCalled();
        expect(repositoryStub.save).toHaveBeenCalled();
        expect(pubSubStub.publish).toHaveBeenCalled();
      });
    });
  });

  describe("findByTeam", () => {
    it("makes expected calls", () => {
      const repositoryStub = testModule.get<DisciplineRepository>(DisciplineRepository);
      spyOn(repositoryStub, "find");
      service.findByTeam(teamStub);
      expect(repositoryStub.find).toHaveBeenCalled();
    });
  });

  describe("findByParticipant", () => {
    it("makes expected calls", () => {
      spyOn(service, "findOneById");
      service.findByParticipant(teamInDisciplineStub).then(result => {
        expect(service.findOneById).toHaveBeenCalled();
      });
    });
  });

  describe("findByTournament", () => {
    it("makes expected calls", () => {
      spyOn(service, "findByTournamentId");
      service.findByTournament(tournamentStub);
      expect(service.findByTournamentId).toHaveBeenCalled();
    });
  });
});
