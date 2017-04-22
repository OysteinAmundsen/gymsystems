import { TestBed, inject } from '@angular/core/testing';

import { ScheduleService } from './schedule.service';

describe('ScheduleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScheduleService]
    });
  });

  it('should ...', inject([ScheduleService], (service: ScheduleService) => {
    expect(service).toBeTruthy();
  }));
});
