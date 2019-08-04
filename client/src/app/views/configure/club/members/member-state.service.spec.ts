import { TestBed, inject } from '@angular/core/testing';

import { MemberStateService } from './member-state.service';

describe('views.configure.club.members.MemberStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MemberStateService]
    });
  });

  it('should be created', inject([MemberStateService], (service: MemberStateService) => {
    expect(service).toBeTruthy();
  }));
});
