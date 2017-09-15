import { TestBed, inject } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';

import { VenueService } from './venue.service';

describe('VenueService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VenueService]
    });
  });

  it('should be created', inject([VenueService], (service: VenueService) => {
    expect(service).toBeTruthy();
  }));
});
