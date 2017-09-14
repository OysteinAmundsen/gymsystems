import { TestBed, inject } from '@angular/core/testing';

import { EventService } from './event.service';

describe('services.api:EventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventService]
    });
  });

  it('should be created', inject([EventService], (service: EventService) => {
    expect(service).toBeTruthy();
  }));
});
