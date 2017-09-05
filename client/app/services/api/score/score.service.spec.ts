import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { ScoreService } from './score.service';

describe('services.api:ScoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [ScoreService]
    });
  });

  it('should ...', inject([ScoreService], (service: ScoreService) => {
    expect(service).toBeTruthy();
  }));
});
