import { Test, TestingModule } from '@nestjs/testing';
import { MediaController } from './media.controller';

describe('Media Controller', () => {
  let testModule: TestingModule;
  const mediaServiceStub = {
    save: () => { },
    findByTeamAndDiscipline: () => { },
    remove: () => { }
  };

  beforeAll(async () => {
    testModule = await Test.createTestingModule({
      controllers: [MediaController],
      providers: [
        { provide: 'MediaService', useValue: mediaServiceStub }
      ]
    }).compile();
  });
  it('should be defined', () => {
    const controller: MediaController = testModule.get(MediaController);
    expect(controller).toBeDefined();
  });
});
