import { TestBed, inject } from '@angular/core/testing';

import { DisplayService } from './display.service';

describe('DisplayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DisplayService]
    });
  });

  it('should ...', inject([DisplayService], (service: DisplayService) => {
    expect(service).toBeTruthy();
  }));
});
