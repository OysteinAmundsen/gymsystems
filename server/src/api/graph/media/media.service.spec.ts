import { TestingModule, Test } from '@nestjs/testing';
import { Repository } from "typeorm";
import { PubSub } from "graphql-subscriptions";
import { MediaService } from "./media.service";
import { Media } from './media.model';
import { Tournament } from '../tournament/tournament.model';
import { Team } from '../team/team.model';

export class MediaRepository extends Repository<Media> { }

describe("MediaService", () => {
  let service: MediaService;
  let testModule: TestingModule;

  const tournamentStub = <Tournament>{ id: {} };
  const teamStub = <Team>{ id: {} };

  beforeAll(async () => {
    const teamServiceStub = {
      findOneByIdWithTournament: () => Promise.resolve({})
    };
    const disciplineServiceStub = {
      findOneById: () => Promise.resolve({})
    };
    const clubServiceStub = {
      findOneById: () => Promise.resolve({})
    };
    testModule = await Test.createTestingModule({
      providers: [
        MediaService,
        { provide: 'MediaRepository', useClass: MediaRepository },
        { provide: 'TeamService', useValue: teamServiceStub },
        { provide: 'DisciplineService', useValue: disciplineServiceStub },
        { provide: 'ClubService', useValue: clubServiceStub },
        { provide: 'PubSubInstance', useValue: new PubSub() }
      ],
    }).compile();
    service = testModule.get<MediaService>(MediaService);
  });

  it("can load instance", () => {
    expect(service).toBeTruthy();
  });

  describe("findByTournament", () => {
    it("makes expected calls", () => {
      const repository = testModule.get(MediaRepository);
      spyOn(repository, "find");
      service.findByTournament(tournamentStub);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe("findByTeam", () => {
    it("makes expected calls", () => {
      spyOn(service, "findByTeamId");
      service.findByTeam(teamStub);
      expect(service.findByTeamId).toHaveBeenCalled();
    });
  });

  describe("findAll", () => {
    it("makes expected calls", () => {
      const repositoryStub = testModule.get(MediaRepository);
      spyOn(repositoryStub, "find");
      service.findAll();
      expect(repositoryStub.find).toHaveBeenCalled();
    });
  });

  describe("listAll", () => {
    it("makes expected calls", () => {
      const repositoryStub = testModule.get(MediaRepository);
      spyOn(repositoryStub, "find");
      service.listAll();
      expect(repositoryStub.find).toHaveBeenCalled();
    });
  });

  describe("save", () => {
    it("can store club default track", () => {
      // TODO: Implement me
    });
    it("can store club track using named discipline", () => {
      // TODO: Implement me
    });
    it("can store track for a given team in a discipline", () => {
      // TODO: Implement me
    });
  });

  describe("remove", () => {
    it("will cleanup", () => {
      // TODO: Implement me
    });
  });

  describe("findOneBy", () => {
    it("will return club default track", () => {
      // TODO: Implement me
    });
    it("will return club track using named discipline", () => {
      // TODO: Implement me
    });
    it("will return team in discipline track", () => {
      // TODO: Implement me
    });
  });

  describe("createMediaArchive", () => {
    it("will create correct folder structure", () => {
      // TODO: Implement me
    });
  });

  describe("removeArchive", () => {
    it("will cleanup", () => {
      // TODO: Implement me
    });
  });

  describe("expireArchive", () => {
    it("will cleanup", () => {
      // TODO: Implement me
    });
  });
});
