import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { ClubService } from './club.service';

describe('ClubService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [ClubService]
    });
  });

  it('should ...', inject([ClubService], (service: ClubService) => {
    expect(service).toBeTruthy();
  }));
});
