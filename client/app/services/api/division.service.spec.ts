import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { DivisionService } from './division.service';

describe('DivisionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [DivisionService]
    });
  });

  it('should ...', inject([DivisionService], (service: DivisionService) => {
    expect(service).toBeTruthy();
  }));
});
