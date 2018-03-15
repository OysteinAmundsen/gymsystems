import { TestBed, inject } from '@angular/core/testing';

import { JudgeService } from './judge.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('JudgeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [JudgeService]
    });
  });

  it('should be created', inject([JudgeService], (service: JudgeService) => {
    expect(service).toBeTruthy();
  }));
});
