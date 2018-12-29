import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from "./auth.service";
import { JwtPayload } from "./dto/jwt-payload.dto";
import { Config } from "../config";
import { JwtStrategy } from "./jwt.strategy";
import { User } from '../../graph/user/user.model';

describe("JwtStrategy", () => {
  let service: JwtStrategy;
  let testModule: TestingModule;

  beforeAll(async () => {
    const authServiceStub = { validateToken: () => ({}) };
    const configStub = { get: () => ({}) };

    testModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: AuthService, useValue: authServiceStub },
        { provide: Config, useValue: configStub }
      ]
    }).compile();
    service = testModule.get<JwtStrategy>(JwtStrategy);
  });

  it("can load instance", () => {
    expect(service).toBeTruthy();
  });

  describe("validate", () => {
    it("should throw when token is invalid", () => {
      const authServiceStub = testModule.get<AuthService>(AuthService);
      spyOn(authServiceStub, "validateToken").and.callFake(() => null)
      service.validate(<JwtPayload>{ id: -1 }, (err, user) => {
        expect(err).not.toBeNull();
        expect(user).toBeNull();
      });
      expect(authServiceStub.validateToken).toHaveBeenCalled();
    });

    it("should return user when token is valid", () => {
      const authServiceStub = testModule.get<AuthService>(AuthService);
      spyOn(authServiceStub, "validateToken").and.callFake(() => <User>{ id: 1, name: 'test user' })

      service.validate(<JwtPayload>{ id: 1 }, (err, user) => {
        expect(err).toBeNull();
        expect(user).not.toBeNull();
      });
      expect(authServiceStub.validateToken).toHaveBeenCalled();
    });
  });
});
