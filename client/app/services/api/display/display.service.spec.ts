import { TestBed, inject } from '@angular/core/testing';

import { Response, ResponseOptions, BaseRequestOptions, Http } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { DisplayService } from './display.service';

describe('services.api:DisplayService', () => {
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
        DisplayService
      ]
    });
  });

  it('should be created', inject([DisplayService], (service: DisplayService) => {
    expect(service).toBeTruthy();
  }));
});
