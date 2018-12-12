import { TestBed, inject } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DisciplineService } from './discipline.service';

describe('services.api:DisciplineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DisciplineService]
    });
  });

  it('should be created', inject([DisciplineService], (service: DisciplineService) => {
    expect(service).toBeTruthy();
  }));
});
