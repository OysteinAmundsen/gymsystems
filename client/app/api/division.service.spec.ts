import { TestBed, inject } from '@angular/core/testing';
import { DivisionService } from './division.service';

describe('DivisionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DivisionService]
    });
  });

  it('should ...', inject([DivisionService], (service: DivisionService) => {
    expect(service).toBeTruthy();
  }));
});
