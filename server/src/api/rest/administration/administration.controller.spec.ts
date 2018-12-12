import { Test, TestingModule } from '@nestjs/testing';
import { AdministrationController } from './administration.controller';

describe('Administration Controller', () => {
  let module: TestingModule;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [AdministrationController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: AdministrationController = module.get<AdministrationController>(AdministrationController);
    expect(controller).toBeDefined();
  });
});
