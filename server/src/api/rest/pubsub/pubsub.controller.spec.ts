import { Test, TestingModule } from '@nestjs/testing';
import { PubsubController } from './pubsub.controller';
import { PubSub } from 'graphql-subscriptions';

describe('Pubsub Controller', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [PubsubController],
      providers: [
        { provide: 'PubSubInstance', useValue: new PubSub() }
      ]
    }).compile();
  });
  it('should be defined', () => {
    const controller: PubsubController = module.get<PubsubController>(PubsubController);
    expect(controller).toBeDefined();
  });
});
