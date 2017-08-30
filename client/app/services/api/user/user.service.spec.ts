import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { UserService } from './user.service';

describe('services.api:UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [UserService]
    });
  });

  it('should ...', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});
