import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from "typeorm";
import { User } from "../user/user.model";
import { Club } from "../club/club.model";
import { Venue } from "../venue/venue.model";
import { Gymnast } from "../gymnast/gymnast.model";
import { PubSub } from "graphql-subscriptions";
import { ScheduleService } from "../schedule/schedule.service";
import { DisciplineService } from "../discipline/discipline.service";
import { DivisionService } from "../division/division.service";
import { MediaService } from "../media/media.service";
import { TournamentService } from "./tournament.service";
import { Tournament } from './tournament.model';

const tournamentDtoStub = <Tournament>{ id: 1, name: 'Test turnering', endDate: new Date() };

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
      createArchive: () => ({}),
      removeArchive: () => ({})
    };

    testModule = await Test.createTestingModule({
      providers: [
        TournamentService,
        { provide: 'TournamentRepository', useClass: TournamentRepository },
        { provide: MediaService, useValue: mediaServiceStub },
        { provide: ScheduleService, useValue: scheduleServiceStub },
        { provide: DivisionService, useValue: divisionServiceStub },
        { provide: DisciplineService, useValue: disciplineServiceStub },
        { provide: 'PubSubInstance', useValue: new PubSub() },
      ]
    }).compile();
    service = testModule.get<TournamentService>(TournamentService);
  });

  it("can load instance", () => {
    expect(service).toBeDefined();
  });

  describe("save", () => {
    it("updating makes expected calls", () => {
      const repositoryStub = testModule.get<TournamentRepository>(TournamentRepository);
      const pubSubStub = testModule.get<PubSub>('PubSubInstance');
      const mediaServiceStub = testModule.get<MediaService>(MediaService);
      spyOn(repositoryStub, "findOne").and.callFake(() => tournamentDtoStub);
      spyOn(repositoryStub, "save").and.callFake(() => tournamentDtoStub);
      spyOn(service, "createDefaults");
      spyOn(mediaServiceStub, "createArchive");
      spyOn(pubSubStub, "publish");
      service.save(tournamentDtoStub).then(result => {
        expect(repositoryStub.findOne).toHaveBeenCalled();
        expect(repositoryStub.save).toHaveBeenCalled();
        expect(service.createDefaults).not.toHaveBeenCalled();
        expect(mediaServiceStub.createArchive).not.toHaveBeenCalled();
        expect(pubSubStub.publish).toHaveBeenCalled();
      });
    });

    it("inserting makes expected calls", () => {
      const repositoryStub = testModule.get<TournamentRepository>(TournamentRepository);
      const pubSubStub = testModule.get<PubSub>('PubSubInstance');
      const mediaServiceStub = testModule.get<MediaService>(MediaService);
      const newTournamentStub = <Tournament>{ name: 'Test turnering' };
      spyOn(repositoryStub, "findOne");
      spyOn(repositoryStub, "save").and.callFake(() => tournamentDtoStub);
      spyOn(service, "createDefaults").and.callFake(() => true);
      spyOn(mediaServiceStub, "createArchive");
      spyOn(pubSubStub, "publish");
      service.save(newTournamentStub).then(result => {
        expect(repositoryStub.findOne).not.toHaveBeenCalled();
        expect(repositoryStub.save).toHaveBeenCalled();
        expect(service.createDefaults).toHaveBeenCalled();
        expect(mediaServiceStub.createArchive).toHaveBeenCalled();
        expect(pubSubStub.publish).toHaveBeenCalled();
      });
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
      const repositoryStub = testModule.get<TournamentRepository>(TournamentRepository);
      spyOn(repositoryStub, "find");
      service.findBanquetByGymnast(gymnastStub);
      expect(repositoryStub.find).toHaveBeenCalled();
    });
  });

  describe("findTransportByGymnast", () => {
    it("makes expected calls", () => {
      const repositoryStub = testModule.get<TournamentRepository>(TournamentRepository);
      spyOn(repositoryStub, "find");
      service.findTransportByGymnast(gymnastStub);
      expect(repositoryStub.find).toHaveBeenCalled();
    });
  });

  describe("findLodgingByGymnast", () => {
    it("makes expected calls", () => {
      const repositoryStub = testModule.get<TournamentRepository>(TournamentRepository);
      spyOn(repositoryStub, "find");
      service.findLodgingByGymnast(gymnastStub);
      expect(repositoryStub.find).toHaveBeenCalled();
    });
  });

  describe("findAll", () => {
    it("makes expected calls", () => {
      const repositoryStub = testModule.get<TournamentRepository>(TournamentRepository);
      spyOn(repositoryStub, "find");
      service.findAll();
      expect(repositoryStub.find).toHaveBeenCalled();
    });
  });

  describe("createDefaults", () => {
    it("fails if a dependency fails", () => {
      const disciplineStub = testModule.get<DisciplineService>(DisciplineService);
      const divisionStub = testModule.get<DivisionService>(DivisionService);

      spyOn(disciplineStub, "createDefaults").and.callFake(() => false);
      spyOn(divisionStub, "createDefaults").and.callFake(() => true);
      service.createDefaults(1).then(result => {
        expect(result).toBeFalsy();
      });
    });

    it("succeeds if all dependencies succeed", () => {
      const disciplineStub = testModule.get<DisciplineService>(DisciplineService);
      const divisionStub = testModule.get<DivisionService>(DivisionService);

      spyOn(disciplineStub, "createDefaults").and.callFake(() => true);
      spyOn(divisionStub, "createDefaults").and.callFake(() => true);
      service.createDefaults(1).then(result => {
        expect(result).toBeTruthy();
      });
    });
  });
});
