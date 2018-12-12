import { Test, TestingModule } from '@nestjs/testing';
import { PubsubController } from './pubsub.controller';

describe('Pubsub Controller', () => {
  let module: TestingModule;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [PubsubController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: PubsubController = module.get<PubsubController>(PubsubController);
    expect(controller).toBeDefined();
  });
});
