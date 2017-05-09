import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { TournamentService } from './tournament.service';

describe('TournamentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [TournamentService]
    });
  });

  it('should ...', inject([TournamentService], (service: TournamentService) => {
    expect(service).toBeTruthy();
  }));
});
