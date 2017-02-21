import { TestBed, inject } from '@angular/core/testing';
import { TeamsService } from './teams.service';

describe('TeamsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TeamsService]
    });
  });

  it('should ...', inject([TeamsService], (service: TeamsService) => {
    expect(service).toBeTruthy();
  }));
});
