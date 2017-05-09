import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { RoleService } from './role.service';
import { UserService } from 'app/services/api';

describe('RoleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        RoleService,
        UserService
      ]
    });
  });

  it('should ...', inject([RoleService], (service: RoleService) => {
    expect(service).toBeTruthy();
  }));
});
