import { Test, TestingModule } from '@nestjs/testing';
import { VenueService } from "./venue.service";
import { VenueController } from "./venue.controller";

describe("VenueController", () => {
  let controller: VenueController;

  beforeEach(async () => {
    const venueServiceStub = {
      findLocationByAddress: () => Promise.resolve({})
    };
    const testModule: TestingModule = await Test.createTestingModule({
      controllers: [VenueController],
      providers: [
        { provide: VenueService, useValue: venueServiceStub }
      ]
    }).compile();

    controller = testModule.get<VenueController>(VenueController);
  });

  it("can load instance", () => {
    expect(controller).toBeDefined();
  });
});
