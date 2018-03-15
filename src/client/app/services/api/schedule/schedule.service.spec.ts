import { TestBed, inject } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ScheduleService } from './schedule.service';
import { ConfigurationService } from '../configuration/configuration.service';
import { ConfigurationServiceStub } from '../configuration/configuration.service.stub';

describe('services.api:ScheduleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ScheduleService,
        {provide: ConfigurationService, useClass: ConfigurationServiceStub}
      ]
    });
  });

  it('should be created', inject([ScheduleService], (service: ScheduleService) => {
    expect(service).toBeTruthy();
  }));
});
