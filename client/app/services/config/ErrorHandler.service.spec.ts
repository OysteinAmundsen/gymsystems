import { TestBed, inject } from '@angular/core/testing';

import { ErrorHandlerService } from './ErrorHandler.service';

describe('ErrorHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorHandlerService]
    });
  });

  it('should ...', inject([ErrorHandlerService], (service: ErrorHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
