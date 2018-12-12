import { TestBed, inject } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TournamentService } from './tournament.service';

describe('services.api:TournamentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TournamentService]
    });
  });

  it('should be created', inject([TournamentService], (service: TournamentService) => {
    expect(service).toBeTruthy();
  }));

  // TODO: Create tests for these
  // mapDate(tournament: ITournament)
  // dateSpan(tournament: ITournament): string
});
