import { TestBed, inject } from '@angular/core/testing';

import { EventService } from './event.service';

describe('EventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventService]
    });
  });

  it('should ...', inject([EventService], (service: EventService) => {
    expect(service).toBeTruthy();
  }));
});
