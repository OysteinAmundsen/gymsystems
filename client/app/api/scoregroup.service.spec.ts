import { TestBed, inject } from '@angular/core/testing';
import { ScoreGroupService } from './scoregroup.service';

describe('ScoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScoreGroupService]
    });
  });

  it('should ...', inject([ScoreGroupService], (service: ScoreGroupService) => {
    expect(service).toBeTruthy();
  }));
});
