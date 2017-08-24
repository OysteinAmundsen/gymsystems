import { TestBed, inject } from '@angular/core/testing';

import { TroopService } from './troop.service';

describe('TroopService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TroopService]
    });
  });

  it('should be created', inject([TroopService], (service: TroopService) => {
    expect(service).toBeTruthy();
  }));
});
