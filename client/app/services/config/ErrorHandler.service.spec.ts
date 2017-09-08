import { TestBed, inject } from '@angular/core/testing';

import { ErrorHandlerService } from './ErrorHandler.service';

describe('services.config:ErrorHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorHandlerService]
    });
  });

  it('can be injected', inject([ErrorHandlerService], (service: ErrorHandlerService) => {
    expect(service).toBeTruthy();
  }));

  it('will display a temporary message', inject([ErrorHandlerService], async (service: ErrorHandlerService) => {
    service.error = 'TEST';
    expect(service.error).toBe('TEST');
    await setTimeout(() => {
      expect(service.error).toBeNull('Message did not clear out in time')
    }, 10 * 1001);
  }));
});
