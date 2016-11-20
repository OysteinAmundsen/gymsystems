/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ScoreService } from './score.service';

describe('ScoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScoreService]
    });
  });

  it('should ...', inject([ScoreService], (service: ScoreService) => {
    expect(service).toBeTruthy();
  }));
});
