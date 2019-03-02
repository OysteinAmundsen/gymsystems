import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from "typeorm";
import { Team } from "../team/team.model";
import { Tournament } from "../tournament/tournament.model";
import { DivisionDto } from "./dto/division.dto";
import { PubSub } from "graphql-subscriptions";
import { DivisionService } from "./division.service";
import { Division, DivisionType } from './division.model';

export class DivisionRepository extends Repository<Division> { }

describe("DivisionService", () => {
  let service: DivisionService;
  let testModule: TestingModule;

  beforeAll(async () => {
    const configurationServiceStub = {
      getOneById: () => ({
        value: JSON.stringify({
          division: [
            { name: 'Aspirant', type: DivisionType.Age },
            { name: 'Rekrutt', type: DivisionType.Age },
            { name: 'Junior', type: DivisionType.Age },
            { name: 'Senior', type: DivisionType.Age },
            { name: 'Kvinner', type: DivisionType.Gender },
            { name: 'Herrer', type: DivisionType.Gender },
            { name: 'Mix', type: DivisionType.Gender }
          ]
        })
      })
    };

    testModule = await Test.createTestingModule({
      providers: [
        DivisionService,
        { provide: 'DivisionRepository', useClass: DivisionRepository },
        { provide: 'PubSubInstance', useValue: new PubSub() },
        { provide: 'ConfigurationService', useValue: configurationServiceStub }
      ]
    }).compile();
    service = testModule.get<DivisionService>(DivisionService);
  });

  it("can load instance", () => {
    expect(service).toBeTruthy();
  });

  it("localCache defaults to: []", () => {
    expect(service.localCache).toEqual([]);
  });

  describe("save", () => {
    it("makes expected calls", async () => {
      const repositoryStub = testModule.get<DivisionRepository>(DivisionRepository);
      const pubSubStub: PubSub = testModule.get('PubSubInstance');
      spyOn(repositoryStub, "findOne").and.callFake(() => <DivisionDto>{ id: 1, name: 'Old Division' });
      spyOn(repositoryStub, "save").and.callFake(div => div);
      spyOn(pubSubStub, "publish");
      const result = await service.save(<DivisionDto>{ id: 1, name: 'Test Division' });
      expect(repositoryStub.findOne).toHaveBeenCalled();
      expect(repositoryStub.save).toHaveBeenCalled();
      expect(pubSubStub.publish).toHaveBeenCalled();
    });
  });

  describe("findByTeam", () => {
    it("makes expected calls", () => {
      spyOn(service, "findByTeamId");
      service.findByTeam(<Team>{ id: 1 });
      expect(service.findByTeamId).toHaveBeenCalled();
    });
  });

  describe("findByTournament", () => {
    it("makes expected calls", () => {
      spyOn(service, "findByTournamentId");
      service.findByTournament(<Tournament>{ id: 1 });
      expect(service.findByTournamentId).toHaveBeenCalled();
    });
  });

  describe("createDefaults", () => {
    it("Should create new divisions based on configured defaults", async () => {
      spyOn(service, "saveAll").and.callFake((divisions) => divisions.map((d, idx) => { d.id = idx; return d; }));
      const result = await service.createDefaults(1);
      expect(result).toBeTruthy();
    });
  });
});
