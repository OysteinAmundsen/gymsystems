import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { DisplayService } from './display.service';

describe('services.api:DisplayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [DisplayService]
    });
  });

  it('should ...', inject([DisplayService], (service: DisplayService) => {
    expect(service).toBeTruthy();
  }));
});
