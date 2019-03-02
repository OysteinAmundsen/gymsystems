import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from "typeorm";
import { PubSub } from "graphql-subscriptions";
import { Tournament } from "../tournament/tournament.model";
import { Team } from "../team/team.model";
import { TeamInDiscipline } from "../schedule/team-in-discipline.model";
import { DisciplineService } from "./discipline.service";
import { Discipline } from './discipline.model';

export class DisciplineRepository extends Repository<Discipline> { }

describe("DisciplineService", () => {
  let service: DisciplineService;
  let testModule: TestingModule;
  const tournamentStub = <Tournament>{ id: 1 };
  const teamStub = <Team>{};

  beforeAll(async () => {
    const configurationServiceStub = {
      getOneById: () => Promise.resolve({
        value: JSON.stringify({ discipline: [], scoreGroup: {} })
      })
    };
    const scoreGroupServiceStub = { saveAll: () => ({}) };

    testModule = await Test.createTestingModule({
      providers: [
        DisciplineService,
        { provide: 'DisciplineRepository', useClass: DisciplineRepository },
        { provide: 'PubSubInstance', useValue: new PubSub() },
        { provide: 'ConfigurationService', useValue: configurationServiceStub },
        { provide: 'ScoreGroupService', useValue: scoreGroupServiceStub }
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
    it("makes expected calls", async () => {
      const repositoryStub = testModule.get<DisciplineRepository>(DisciplineRepository);
      const pubSubStub: PubSub = testModule.get('PubSubInstance');
      spyOn(repositoryStub, "findOne").and.callFake(() => ({ id: 1, name: 'Test Discipline' }));
      spyOn(repositoryStub, "save").and.callFake(participant => participant);
      spyOn(pubSubStub, "publish");
      const result = await service.save(<Discipline>{ id: 1 });
      expect(repositoryStub.findOne).toHaveBeenCalled();
      expect(repositoryStub.save).toHaveBeenCalled();
      expect(pubSubStub.publish).toHaveBeenCalled();
    });
  });

  describe("findByTeam", () => {
    it("makes expected calls", async () => {
      const repositoryStub = testModule.get<DisciplineRepository>(DisciplineRepository);
      spyOn(repositoryStub, "find");
      const result = await service.findByTeam(teamStub);
      expect(repositoryStub.find).toHaveBeenCalled();
    });
  });

  describe("findByParticipant", () => {
    it("makes expected calls", async () => {
      spyOn(service, "findOneById").and.callFake(() => <TeamInDiscipline>{ discipline: { id: 1 }, disciplineId: 1 });
      const result = await service.findByParticipant(<TeamInDiscipline>{ disciplineId: 1 });
      expect(service.findOneById).toHaveBeenCalled();
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
