import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { TeamsService } from './teams.service';

describe('services.api:TeamsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [TeamsService]
    });
  });

  it('should ...', inject([TeamsService], (service: TeamsService) => {
    expect(service).toBeTruthy();
  }));
});
