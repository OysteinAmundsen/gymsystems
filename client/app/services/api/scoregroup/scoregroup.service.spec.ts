import { TestBed, inject } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ScoreGroupService } from './scoregroup.service';

describe('services.api:ScoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ScoreGroupService]
    });
  });

  it('should be created', inject([ScoreGroupService], (service: ScoreGroupService) => {
    expect(service).toBeTruthy();
  }));
});
