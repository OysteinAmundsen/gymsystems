import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { ScheduleService } from './schedule.service';
import { ConfigurationService } from 'app/services/api';
import { ConfigurationServiceStub } from '../configuration/configuration.service.stub';

describe('ScheduleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        ScheduleService,
        {provide: ConfigurationService, useClass: ConfigurationServiceStub}
      ]
    });
  });

  it('should ...', inject([ScheduleService], (service: ScheduleService) => {
    expect(service).toBeTruthy();
  }));
});
