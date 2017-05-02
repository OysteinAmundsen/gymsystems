import { TestBed, inject } from '@angular/core/testing';

import { ClubService } from './club.service';

describe('ClubService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClubService]
    });
  });

  it('should ...', inject([ClubService], (service: ClubService) => {
    expect(service).toBeTruthy();
  }));
});
