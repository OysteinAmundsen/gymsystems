import { Test, TestingModule } from '@nestjs/testing';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { MediaRepository } from './media.service.spec';
import { PubSub } from 'graphql-subscriptions';

describe('Media Controller', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [MediaController],
      providers: [
        MediaService,
        { provide: 'MediaRepository', useClass: MediaRepository },
        { provide: 'PubSubInstance', useValue: new PubSub() }
      ]
    }).compile();
  });
  it('should be defined', () => {
    const controller: MediaController = module.get<MediaController>(MediaController);
    expect(controller).toBeDefined();
  });
});
