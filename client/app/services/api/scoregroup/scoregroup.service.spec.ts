import { TestBed, inject } from '@angular/core/testing';

import { Response, ResponseOptions, BaseRequestOptions, Http } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { ScoreGroupService } from './scoregroup.service';

describe('services.api:ScoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
        ScoreGroupService
      ]
    });
  });

  it('should be created', inject([ScoreGroupService], (service: ScoreGroupService) => {
    expect(service).toBeTruthy();
  }));
});
