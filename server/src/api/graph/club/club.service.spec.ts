import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from "typeorm";
import { PubSub } from "graphql-subscriptions";
import { ClubDto } from "./dto/club.dto";
import { ClubService } from "./club.service";
import { of } from 'rxjs';
import { Club } from './club.model';

export class ClubRepository extends Repository<Club> { }

describe("ClubService", () => {
  let service: ClubService;
  let testModule: TestingModule;

  beforeAll(async () => {
    const httpServiceStub = {
      get: () => of({})
    };
    testModule = await Test.createTestingModule({
      providers: [
        ClubService,
        { provide: 'HttpService', useValue: httpServiceStub },
        { provide: 'ClubRepository', useClass: ClubRepository },
        { provide: 'PubSubInstance', useValue: new PubSub() }
      ]
    }).compile();
    service = testModule.get<ClubService>(ClubService);
  });

  it("can load instance", () => {
    expect(service).toBeTruthy();
  });

  it("localCache defaults to: []", () => {
    expect(service.localCache).toEqual([]);
  });

  /**
   *
   */
  describe("save", () => {
    it("Can update existing club", async () => {
      const repositoryStub: ClubRepository = testModule.get(ClubRepository);
      const pubSubStub: PubSub = testModule.get('PubSubInstance');
      spyOn(repositoryStub, "findOne").and.callFake(() => ({ id: 1, name: 'Test' }));
      spyOn(repositoryStub, "save").and.callFake(entity => entity);
      spyOn(pubSubStub, "publish");

      const result = await service.save(<ClubDto>{ id: 1, name: 'Test club' });
      expect(result).toEqual({ id: 1, name: 'Test club' }, 'name should have changed');
      expect(repositoryStub.findOne).toHaveBeenCalled();
      expect(repositoryStub.save).toHaveBeenCalled();
      expect(pubSubStub.publish).toHaveBeenCalled();
    });

    it("Can persist a new club", async () => {
      const repositoryStub: ClubRepository = testModule.get(ClubRepository);
      const pubSubStub: PubSub = testModule.get('PubSubInstance');
      spyOn(repositoryStub, "findOne");
      spyOn(repositoryStub, "save").and.callFake(entity => Object.assign(entity, { id: 1 }));
      spyOn(pubSubStub, "publish");

      const result = await service.save(<ClubDto>{ name: 'Test club' });
      expect(result).toEqual({ id: 1, name: 'Test club' }, 'name should have changed');
      expect(repositoryStub.findOne).not.toHaveBeenCalled();
      expect(repositoryStub.save).toHaveBeenCalled();
      expect(pubSubStub.publish).toHaveBeenCalled();
    });
  });

  /**
   *
   */
  describe("findOrCreateClub", () => {
    it("Nothing found in db or brreg. Create", async () => {
      spyOn(service, "findByFilter").and.callFake(() => ([]));
      spyOn(service, "save");

      const result = await service.findOrCreateClub(<ClubDto>{ name: 'Test club' });
      expect(service.findByFilter).toHaveBeenCalled();
      expect(service.save).toHaveBeenCalled();
    });

    it("A club is found in brreg, but not registerred in our system. Create it based on brreg data", async () => {
      spyOn(service, "findByFilter").and.callFake(() => ([{ name: 'Test club' }]));
      spyOn(service, "save");

      const result = await service.findOrCreateClub(<ClubDto>{ name: 'Test club' });
      expect(service.findByFilter).toHaveBeenCalled();
      expect(service.save).toHaveBeenCalled();
    });

    it("A Club is allready registerred with this name. Return it.", async () => {
      spyOn(service, "findByFilter").and.callFake(() => ([{ id: 1, name: 'Test club' }]));
      spyOn(service, "save");
      const result = await service.findOrCreateClub(<ClubDto>{ name: 'Test club' });
      expect(result).toEqual({ id: 1, name: 'Test club' });
      expect(service.findByFilter).toHaveBeenCalled();
      expect(service.save).not.toHaveBeenCalled();
    });

    it("Club given contains id. Return it.", async () => {
      spyOn(service, "findOneById").and.callFake((club) => club);
      spyOn(service, "findByFilter");
      spyOn(service, "save");

      const result = await service.findOrCreateClub(<ClubDto>{ id: 1, name: 'Test club' });
      expect(service.findOneById).toHaveBeenCalled();
      expect(service.findByFilter).not.toHaveBeenCalled();
      expect(service.save).not.toHaveBeenCalled();
    });
  });

  /**
   *
   */
  describe("findByFilter", () => {
    it("Can return a properly concatenated list", async () => {
      spyOn(service, "findOwnClubByName").and.callFake(() => ([{ id: 1, name: 'Test Club' }]));
      spyOn(service, "brregLookup").and.callFake(() => ([{ name: 'Test' }, { name: 'Test Club' }, { name: 'Testing club' }]))

      const result = await service.findByFilter('Test');
      expect(result.length).toBe(3, 'Should have merged results');
      expect(result.filter(r => r.id != null).length).toBe(1, 'Only 1 result from database');
    });
  });
});
