import { TestBed, inject } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DivisionService } from './division.service';

describe('services.api:DivisionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DivisionService]
    });
  });

  it('should be created', inject([DivisionService], (service: DivisionService) => {
    expect(service).toBeTruthy();
  }));
});
