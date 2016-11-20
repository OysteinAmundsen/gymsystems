/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TournamentService } from './tournament.service';

describe('Service: Tournament', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TournamentService]
    });
  });

  it('should ...', inject([TournamentService], (service: TournamentService) => {
    expect(service).toBeTruthy();
  }));
});
