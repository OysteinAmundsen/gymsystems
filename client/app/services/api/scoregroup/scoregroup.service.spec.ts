import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { ScoreGroupService } from './scoregroup.service';

describe('services.api:ScoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [ScoreGroupService]
    });
  });

  it('should ...', inject([ScoreGroupService], (service: ScoreGroupService) => {
    expect(service).toBeTruthy();
  }));
});
