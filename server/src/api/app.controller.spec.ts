import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
const pkg = require('api/../../package.json');

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController]
    }).compile();
  });

  describe('root', () => {
    it('should return name and version from package.json', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.root()).toEqual({ name: pkg.name, version: pkg.version });
    });
  });
});
