import { TestBed, inject } from '@angular/core/testing';

import { Response, ResponseOptions, BaseRequestOptions, Http } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { ScoreService } from './score.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('services.api:ScoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ScoreService]
    });
  });

  it('should be created', inject([ScoreService], (service: ScoreService) => {
    expect(service).toBeTruthy();
  }));

  // TODO: Create tests for these
  // calculateTeamTotal(participants: ITeamInDiscipline[])
  // calculateScoreGroupTotal(participant: ITeamInDiscipline, type: string)
  // calculateTotal(participant: ITeamInDiscipline)
  // fixScore(score)
});
