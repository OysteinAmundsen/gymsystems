import { Test, TestingModule } from '@nestjs/testing';
import { JwtPayload } from "./dto/jwt-payload.dto";
import { Config } from "../config";
import { User } from "../../graph/user/user.model";
import { Response } from "express";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let service: AuthService;
  let testModule: TestingModule;

  const jwtPayloadStub = <JwtPayload>{ id: {} };
  const userStub = <User>{ id: {}, name: {}, email: {}, role: {}, clubId: {} };
  const responseStub = <Response><unknown>{ set: () => ({}) };

  beforeAll(async () => {
    const jwtServiceStub = { sign: () => ({}) };
    const userServiceStub = { findOneById: () => ({}) };
    const configStub = { get: () => ({}) };

    testModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: 'JwtService', useValue: jwtServiceStub },
        { provide: 'UserService', useValue: userServiceStub },
        { provide: 'Config', useValue: configStub }
      ]
    }).compile();
    service = testModule.get<AuthService>(AuthService);
  });

  it("can load instance", () => {
    expect(service).toBeTruthy();
  });

  describe("signIn", () => {
    it("makes expected calls", () => {
      spyOn(service, "createToken").and.callThrough();
      spyOn(responseStub, "set");
      service.signIn(responseStub, userStub);
      expect(service.createToken).toHaveBeenCalled();
      expect(responseStub.set).toHaveBeenCalled();
    });
  });

  describe("createToken", () => {
    it("makes expected calls", () => {
      const jwtServiceStub = testModule.get('JwtService');
      const configStub: Config = testModule.get(Config);
      spyOn(jwtServiceStub, "sign");
      spyOn(configStub, "get");
      service.createToken(userStub);
      expect(jwtServiceStub.sign).toHaveBeenCalled();
      expect(configStub.get).toHaveBeenCalled();
    });
  });

  describe("validateToken", () => {
    it("makes expected calls", () => {
      const userServiceStub = testModule.get('UserService');
      spyOn(userServiceStub, "findOneById");
      service.validateToken(jwtPayloadStub);
      expect(userServiceStub.findOneById).toHaveBeenCalled();
    });
  });
});
