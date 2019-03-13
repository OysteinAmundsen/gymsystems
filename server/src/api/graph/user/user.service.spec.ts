import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from "typeorm";
import { User, Role } from "./user.model";
import { Club } from "../club/club.model";
import { PubSub } from "graphql-subscriptions";
import { UserDto } from "./dto/user.dto";
import { UserService } from "./user.service";

export class UserRepository extends Repository<User> {
}
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
    it("will refuse to update if no authenticated user is present", async () => {
      spyOn(service, "getAuthenticatedUser").and.callFake(() => null);
      try {
        const result = await service.changePassword(null, 'NewPassword');
        fail('Should throw when not logged in');
      } catch (ex) { }
    });

    it("will update user entity with encrypted password", async () => {
      const repositoryStub = testModule.get(UserRepository);
      const authUser = <User>{ id: 1, role: Role.User, name: 'Test user' };
      spyOn(service, "getAuthenticatedUser").and.callFake(() => authUser);
      spyOn(repositoryStub, "update").and.callFake(() => Promise.resolve('anything'));

      const result = await service.changePassword(authUser, 'NewPassword');
      expect(repositoryStub.update).toHaveBeenCalled();
    });
  });

  /**
   *
   */
  describe("save", () => {
    it('Should throw when creating a user when role of self is lower than club', async () => {
      spyOn(service, "getAuthenticatedUser").and.callFake(() => ({ id: 1, name: 'Test', role: Role.User }));
      try {
        const result = await service.save(<UserDto>{ name: 'New user', role: Role.Organizer });
        fail('Should throw');
      } catch (ex) {
        expect(ex.status).toBe(403);
      }
    });

    it('Should throw when creating a user with higher privileges than self', async () => {
      spyOn(service, "getAuthenticatedUser").and.callFake(() => ({ id: 1, name: 'Test', role: Role.Club }));
      try {
        const result = await service.save(<UserDto>{ name: 'New user', role: Role.Organizer });
        fail('Should throw');
      } catch (ex) {
        expect(ex.status).toBe(403);
      }
    });

    it('Should throw when registerring a user which has neither club nor organizer role', async () => {
      try {
        const result = await service.save(<UserDto>{ name: 'New user', role: Role.Admin });
        fail('Should throw');
      } catch (ex) {
        expect(ex.status).toBe(403);
      }
    });

    it('Should not allow registration of existing username', async () => {
      spyOn(service, "findOneByUsername").and.callFake(() => ({ id: 1, name: 'Existing user' }));
      spyOn(service, "findOneByEmail").and.callFake(() => undefined);
      try {
        const result = await service.save(<UserDto>{ name: 'Existing user' });
        fail('Should throw when username is taken');
      } catch (ex) {
        expect(ex.status).toBe(403);
      }
    });

    it('Should not allow registration of existing email', async () => {
      spyOn(service, "findOneByUsername").and.callFake(() => undefined);
      spyOn(service, "findOneByEmail").and.callFake(() => ({ id: 1, email: 'existing@user.no' }));
      try {
        const result = await service.save(<UserDto>{ email: 'existing@user.no' });
        fail('Should throw when email is taken');
      } catch (ex) {
        expect(ex.status).toBe(403);
      }
    });

    it('Should not allow a registration without a club', async () => {
      spyOn(service, "findOneByUsername").and.callFake(() => undefined);
      spyOn(service, "findOneByEmail").and.callFake(() => undefined);
      try {
        const result = await service.save(<UserDto>{ name: 'New User', role: Role.Organizer });
        fail('Should throw when club is null');
      } catch (ex) {
        expect(ex.status).toBe(403);
      }
    });

    // FIXME: Failed: [Error: [object Object]]
    // it('Should try to find or create a club when its given as a string', async () => {
    //   const clubServiceStub = testModule.get('ClubService');
    //   const repositoryStub = testModule.get('UserRepository');

    //   spyOn(service, "findOneByUsername").and.callFake(() => undefined);
    //   spyOn(service, "findOneByEmail").and.callFake(() => undefined);
    //   spyOn(clubServiceStub, "findOrCreateClub").and.callFake(clubName => ({ id: 1, name: clubName }));
    //   spyOn(repositoryStub, "save").and.callFake(obj => obj);

    //   const result = await service.save(<UserDto><unknown>{ name: 'New User', club: 'Test club' });
    //   expect(clubServiceStub.findOrCreateClub).toHaveBeenCalled();
    //   expect(repositoryStub.save).toHaveBeenCalled();
    // });

    it("Can update an existing user", async () => {
      const repositoryStub = testModule.get('UserRepository');
      spyOn(service, "findOneById").and.callFake(id => ({ id: id, name: 'Old name' }));
      spyOn(repositoryStub, "save").and.callFake(obj => obj);
      spyOn(repositoryStub, "findOne").and.callFake(() => ({ id: 1, name: 'Old name' }));
      const result = await service.save(<UserDto>{ id: 1, name: 'Test user' });
      expect(repositoryStub.save).toHaveBeenCalledWith({ id: 1, name: 'Test user' });
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
