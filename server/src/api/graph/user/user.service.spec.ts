import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from "typeorm";
import { User, Role } from "./user.model";
import { Club } from "../club/club.model";
import { PubSub } from "graphql-subscriptions";
import { UserDto } from "./dto/user.dto";
import { UserService } from "./user.service";

export class UserRepository extends Repository<User> { }
export class ClubRepository extends Repository<Club> { }

describe("UserService", () => {
  let service: UserService;
  let testModule: TestingModule;
  const userStub = { password: '' };
  const userDtoStub = <UserDto>{
    id: 1,
    role: Role.Club,
    password: '',
    name: '',
    email: '',
    clubId: 1,
    club: { id: 1, name: 'TestClub' }
  };
  const clubStub = <Club>{ id: 1 };

  beforeAll(async () => {
    const clubServiceStub = {
      findOneById: () => ({}),
      findOrCreateClub: () => ({})
    };

    testModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: 'ClubService', useValue: clubServiceStub },
        { provide: 'UserRepository', useClass: UserRepository },
        { provide: 'ClubRepository', useClass: ClubRepository },
        { provide: 'PubSubInstance', useValue: new PubSub() }
      ]
    }).compile();
    service = testModule.get<UserService>(UserService);
  });

  it("can load instance", () => {
    expect(service).toBeTruthy();
  });

  /**
   *
   */
  describe("findByClub", () => {
    it("makes expected calls", () => {
      spyOn(service, "findByClubId");
      service.findByClub(clubStub);
      expect(service.findByClubId).toHaveBeenCalled();
    });
  });

  /**
   *
   */
  describe("changePassword", () => {
    it("will refuse to update if no authenticated user is present", () => {
      spyOn(service, "getAuthenticatedUser").and.callFake(() => null);
      service.changePassword('NewPassword')
        .then(res => fail('Should throw when not logged in'));
    });

    it("will update user entity with encrypted password", () => {
      const repositoryStub = testModule.get(UserRepository);
      spyOn(service, "getAuthenticatedUser").and.callFake(() => ({ id: 1, name: 'Test user' }));
      spyOn(repositoryStub, "update");
      service.changePassword('NewPassword');
      expect(repositoryStub.update).toHaveBeenCalled();
    });
  });

  /**
   *
   */
  describe("save", () => {
    it('Should throw when creating a user when role of self is lower than club', () => {
      spyOn(service, "getAuthenticatedUser").and.callFake(() => ({ id: 1, name: 'Test', role: Role.User }));
      service.save(<UserDto>{ name: 'New user', role: Role.Organizer })
        .then(res => fail('Should throw'))
        .catch(res => expect(res.status).toEqual(403));
    });

    it('Should throw when creating a user with higher privileges than self', () => {
      spyOn(service, "getAuthenticatedUser").and.callFake(() => ({ id: 1, name: 'Test', role: Role.Club }));
      service.save(<UserDto>{ name: 'New user', role: Role.Organizer })
        .then(res => fail('Should throw'))
        .catch(res => expect(res.status).toEqual(403));
    });

    it('Should throw when registerring a user which has neither club nor organizer role', () => {
      service.save(<UserDto>{ name: 'New user', role: Role.Admin })
        .then(res => fail('Should throw'))
        .catch(res => expect(res.status).toEqual(403));
    });

    it('Should not allow registration of existing username', () => {
      spyOn(service, "findOneByUsername").and.callFake(() => ({ id: 1, name: 'Existing user' }));
      spyOn(service, "findOneByEmail").and.callFake(() => undefined);
      service.save(<UserDto>{ name: 'Existing user' })
        .then(res => fail('Should throw when username is taken'))
        .catch(res => expect(res.status).toEqual(400));
    });

    it('Should not allow registration of existing email', () => {
      spyOn(service, "findOneByUsername").and.callFake(() => undefined);
      spyOn(service, "findOneByEmail").and.callFake(() => ({ id: 1, email: 'existing@user.no' }));
      service.save(<UserDto>{ email: 'existing@user.no' })
        .then(res => fail('Should throw when email is taken'))
        .catch(res => expect(res.status).toEqual(400));
    });

    it('Should not allow a registration without a club', () => {
      spyOn(service, "findOneByUsername").and.callFake(() => undefined);
      spyOn(service, "findOneByEmail").and.callFake(() => undefined);
      service.save(<UserDto>{ name: 'New User', role: Role.Organizer })
        .then(res => fail('Should throw when club is null'))
        .catch(res => expect(res.status).toEqual(400));
    });

    // FIXME: UnhandledPromiseRejection (Don't know why I get this here)
    it('Should try to find or create a club when its given as a string', () => {
      const clubServiceStub = testModule.get('ClubService');
      const repositoryStub = testModule.get(UserRepository);

      spyOn(service, "findOneByUsername").and.callFake(() => undefined);
      spyOn(service, "findOneByEmail").and.callFake(() => undefined);
      spyOn(clubServiceStub, "findOrCreateClub").and.callFake((club) => ({ id: 1, name: club }));
      spyOn(repositoryStub, "save");
      service.save(<UserDto><unknown>{ name: 'New User', club: 'Test club' }).then(res => {
        expect(clubServiceStub.findOrCreateClub).toHaveBeenCalled();
        expect(repositoryStub.save).toHaveBeenCalled();
      });
    });

    it("Can update an existing user", () => {
      const repositoryStub = testModule.get(UserRepository);
      spyOn(service, "findOneById").and.callFake(id => ({ id: id, name: 'Old name' }));
      spyOn(repositoryStub, "save");
      service.save(<UserDto>{ id: 1, name: 'Test user' }).then(res => {
        expect(repositoryStub.save).toHaveBeenCalledWith({ id: 1, name: 'Test user' });
      });
    })
  });

  /**
   *
   */
  describe("findAll", () => {
    it("makes expected calls", () => {
      const repositoryStub = testModule.get(UserRepository);
      spyOn(repositoryStub, "find");
      service.findAll();
      expect(repositoryStub.find).toHaveBeenCalled();
    });
  });
});
