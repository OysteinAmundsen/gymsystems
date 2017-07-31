import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { DisciplineService } from './discipline.service';

describe('DisciplineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [DisciplineService]
    });
  });

  it('should ...', inject([DisciplineService], (service: DisciplineService) => {
    expect(service).toBeTruthy();
  }));
});
