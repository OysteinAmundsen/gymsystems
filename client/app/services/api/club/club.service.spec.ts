import { TestBed, inject } from '@angular/core/testing';
import { Http } from '@angular/http';
import { BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { ClubService } from 'app/services/api';
import { IClub } from 'app/services/model';

describe('ClubService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ClubService,
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
      ]
    });
  });

  it('should be created', inject([ClubService], (service: ClubService) => {
    expect(service).toBeTruthy();
  }));

  it('should load a list of clubs', inject([ClubService, MockBackend], (service: ClubService, backend: MockBackend) => {
    // Mockup a response
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions(
      { body: <IClub[]>[
        { id: 0, name: 'test-club', teams: [] }
      ]}
    )) ));

    service.all().subscribe((res: IClub[]) => {
      expect(res.length).toBe(1);
      expect(res[0].id).toBe(0);
      expect(res[0].name).toBe('test-club');
    });
  }));
});
