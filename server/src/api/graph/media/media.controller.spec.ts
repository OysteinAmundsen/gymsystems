import { Test, TestingModule } from '@nestjs/testing';
import { MediaController } from './media.controller';

describe('Media Controller', () => {
  let module: TestingModule;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [MediaController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: MediaController = module.get<MediaController>(MediaController);
    expect(controller).toBeDefined();
  });
});
