import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from "typeorm";
import { User } from "../user/user.model";
import { Club } from "../club/club.model";
import { Venue } from "../venue/venue.model";
import { Gymnast } from "../gymnast/gymnast.model";
import { PubSub } from "graphql-subscriptions";
import { TournamentService } from "./tournament.service";
import { Tournament } from './tournament.model';

const tournamentDtoStub = <Tournament>{ id: 1, name: 'Test turnering', endDate: new Date(), clubId: 1 };

export class TournamentRepository extends Repository<Tournament> { }

describe("TournamentService", () => {
  let service: TournamentService;
  let testModule: TestingModule;

  // Test data
  const userStub = <User>{ id: {} };
  const clubStub = <Club>{ id: {} };
  const venueStub = <Venue>{ id: {} };
  const gymnastStub = <Gymnast>{};

  beforeAll(async () => {
    const scheduleServiceStub = { removeByTournament: () => ({}) };
    const disciplineServiceStub = {
      removeByTournament: () => ({}),
      createDefaults: () => ({})
    };
    const divisionServiceStub = {
      removeByTournament: () => ({}),
      createDefaults: () => ({})
    };
    const mediaServiceStub = {
      createMediaArchive: () => ({}),
      removeArchive: () => ({})
    };

    const clubServiceStub = {
      findOneById: () => ({}),
      findOrCreateClub: () => ({})
    };

    testModule = await Test.createTestingModule({
      providers: [
        TournamentService,
        { provide: 'TournamentRepository', useClass: TournamentRepository },
        { provide: 'ClubService', useValue: clubServiceStub },
        { provide: 'MediaService', useValue: mediaServiceStub },
        { provide: 'ScheduleService', useValue: scheduleServiceStub },
        { provide: 'DivisionService', useValue: divisionServiceStub },
        { provide: 'DisciplineService', useValue: disciplineServiceStub },
        { provide: 'PubSubInstance', useValue: new PubSub() },
      ]
    }).compile();
    service = testModule.get<TournamentService>(TournamentService);
  });

  it("can load instance", () => {
    expect(service).toBeDefined();
  });

  // FIXME: Failed: [Error: [object Object]]
  describe("save", () => {
    it("updating makes expected calls", async () => {
      const repositoryStub = testModule.get('TournamentRepository');
      const clubService = testModule.get('ClubService');
      const pubSubStub = testModule.get('PubSubInstance');
      const mediaServiceStub = testModule.get('MediaService');
      spyOn(clubService, "findOneById").and.callFake((id) => ({ id: id, name: 'TestClub' }));
      spyOn(repositoryStub, "findOne").and.callFake(() => tournamentDtoStub);
      spyOn(repositoryStub, "save").and.callFake(() => tournamentDtoStub);
      spyOn(service, "createDefaults");
      spyOn(mediaServiceStub, "createMediaArchive");
      spyOn(pubSubStub, "publish");

      const result = await service.save(tournamentDtoStub);
      expect(repositoryStub.findOne).toHaveBeenCalled();
      expect(repositoryStub.save).toHaveBeenCalled();
      expect(service.createDefaults).not.toHaveBeenCalled();
      expect(mediaServiceStub.createMediaArchive).not.toHaveBeenCalled();
      expect(pubSubStub.publish).toHaveBeenCalled();
    });

    it("inserting makes expected calls", async () => {
      const repositoryStub = testModule.get('TournamentRepository');
      const clubService = testModule.get('ClubService');
      const pubSubStub = testModule.get('PubSubInstance');
      const mediaServiceStub = testModule.get('MediaService');
      const newTournamentStub = <Tournament>{ name: 'Test turnering', clubId: 1 };
      spyOn(clubService, "findOneById").and.callFake((id) => ({ id: id, name: 'TestClub' }));
      spyOn(repositoryStub, "findOne");
      spyOn(repositoryStub, "save").and.callFake(() => tournamentDtoStub);
      spyOn(service, "createDefaults").and.callFake(() => true);
      spyOn(mediaServiceStub, "createMediaArchive");
      spyOn(pubSubStub, "publish");

      const result = await service.save(newTournamentStub);
      expect(repositoryStub.findOne).not.toHaveBeenCalled();
      expect(repositoryStub.save).toHaveBeenCalled();
      expect(service.createDefaults).toHaveBeenCalled();
      expect(mediaServiceStub.createMediaArchive).toHaveBeenCalled();
      expect(pubSubStub.publish).toHaveBeenCalled();
    });
  });

  describe("findByClub", () => {
    it("makes expected calls", () => {
      spyOn(service, "findByClubId");
      service.findByClub(clubStub);
      expect(service.findByClubId).toHaveBeenCalled();
    });
  });

  describe("findByUser", () => {
    it("makes expected calls", () => {
      spyOn(service, "findByUserId");
      service.findByUser(userStub);
      expect(service.findByUserId).toHaveBeenCalled();
    });
  });

  describe("findByVenue", () => {
    it("makes expected calls", () => {
      spyOn(service, "findByVenueId");
      service.findByVenue(venueStub);
      expect(service.findByVenueId).toHaveBeenCalled();
    });
  });

  describe("findBanquetByGymnast", () => {
    it("makes expected calls", () => {
      const repositoryStub = testModule.get(TournamentRepository);
      spyOn(repositoryStub, "find");
      service.findBanquetByGymnast(gymnastStub);
      expect(repositoryStub.find).toHaveBeenCalled();
    });
  });

  describe("findTransportByGymnast", () => {
    it("makes expected calls", () => {
      const repositoryStub = testModule.get(TournamentRepository);
      spyOn(repositoryStub, "find");
      service.findTransportByGymnast(gymnastStub);
      expect(repositoryStub.find).toHaveBeenCalled();
    });
  });

  describe("findLodgingByGymnast", () => {
    it("makes expected calls", () => {
      const repositoryStub = testModule.get(TournamentRepository);
      spyOn(repositoryStub, "find");
      service.findLodgingByGymnast(gymnastStub);
      expect(repositoryStub.find).toHaveBeenCalled();
    });
  });

  describe("findAll", () => {
    it("makes expected calls", () => {
      const repositoryStub = testModule.get(TournamentRepository);
      spyOn(repositoryStub, "find");
      service.findAll();
      expect(repositoryStub.find).toHaveBeenCalled();
    });
  });

  describe("createDefaults", () => {
    it("fails if a dependency fails", async () => {
      const disciplineStub = testModule.get('DisciplineService');
      const divisionStub = testModule.get('DivisionService');

      spyOn(disciplineStub, "createDefaults").and.callFake(() => false);
      spyOn(divisionStub, "createDefaults").and.callFake(() => true);

      const result = await service.createDefaults(1);
      expect(result).toBeFalsy();
    });

    it("succeeds if all dependencies succeed", async () => {
      const disciplineStub = testModule.get('DisciplineService');
      const divisionStub = testModule.get('DivisionService');

      spyOn(disciplineStub, "createDefaults").and.callFake(() => true);
      spyOn(divisionStub, "createDefaults").and.callFake(() => true);
      const result = await service.createDefaults(1);
      expect(result).toBeTruthy();
    });
  });
});
