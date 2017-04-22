import { TestBed, inject } from '@angular/core/testing';
import { TournamentService } from './tournament.service';

describe('TournamentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TournamentService]
    });
  });

  it('should ...', inject([TournamentService], (service: TournamentService) => {
    expect(service).toBeTruthy();
  }));
});
