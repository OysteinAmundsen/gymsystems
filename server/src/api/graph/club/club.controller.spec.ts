import { Test, TestingModule } from '@nestjs/testing';
import { ClubController } from './club.controller';

describe('Club Controller', () => {
  let controller: ClubController;
  let testModule: TestingModule;

  beforeEach(async () => {
    const clubServiceStub = {};
    const gymnastServiceStub = {};
    const exportServiceStub = {};

    testModule = await Test.createTestingModule({
      controllers: [ClubController],
      providers: [
        { provide: 'ClubService', useValue: clubServiceStub },
        { provide: 'GymnastService', useValue: gymnastServiceStub },
        { provide: 'ExportService', useValue: exportServiceStub },
      ]
    }).compile();

    controller = testModule.get<ClubController>(ClubController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
