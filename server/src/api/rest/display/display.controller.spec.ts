import { Test, TestingModule } from '@nestjs/testing';
import { DisplayController } from './display.controller';

describe('Display Controller', () => {
  let module: TestingModule;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [DisplayController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: DisplayController = module.get<DisplayController>(DisplayController);
    expect(controller).toBeDefined();
  });
});
