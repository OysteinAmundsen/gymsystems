import { TestBed, inject } from '@angular/core/testing';

import { HttpCacheService } from './http-cache.service';

describe('HttpCacheService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpCacheService]
    });
  });

  it('should be created', inject([HttpCacheService], (service: HttpCacheService) => {
    expect(service).toBeTruthy();
  }));
});
