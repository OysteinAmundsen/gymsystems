import { TestBed, inject } from '@angular/core/testing';

import { HttpStateService } from './http-state.service';

describe('AuthStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpStateService]
    });
  });

  it('should be created', inject([HttpStateService], (service: HttpStateService) => {
    expect(service).toBeTruthy();
  }));
});
