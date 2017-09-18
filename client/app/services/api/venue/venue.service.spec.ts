import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { VenueService } from './venue.service';
import { IVenue } from 'app/model';

export const dummyVenue = <IVenue>{
  id: null,
  name: 'Test venue',
  longitude: 0.0,
  latitude: 0.0,
  address: 'Some address',
  rentalCost: 0,
  contact: 'Some name',
  contactPhone: 12345678,
  contactEmail: 'some@email.com',
  capacity: 0,
  tournaments: [],
};

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
