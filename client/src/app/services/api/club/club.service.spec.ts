import { TestBed, inject } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ClubService } from 'app/services/api';
import { IClub } from 'app/model';
import { HttpTestingController } from '@angular/common/http/testing';

describe('services.api:ClubService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ClubService
      ]
    });
  });

  it('should be created', inject([ClubService], (service: ClubService) => {
    expect(service).toBeTruthy();
  }));

  it('should load a list of clubs', inject([ClubService], (service: ClubService) => {
    // Mockup a response
    const http = TestBed.get(HttpTestingController);

    // fake response
    const expectedResponse = [{ id: 0, name: 'test-club', teams: [] }];
    let actualResponse;

    // Make the request
    service.all().subscribe((res: IClub[]) => actualResponse = res);
    http.expectOne('/api/clubs').flush(expectedResponse);

    // Test real response
    expect(actualResponse.length).toBe(1);
    expect(actualResponse[0].id).toBe(0);
    expect(actualResponse[0].name).toBe('test-club');
  }));
});
