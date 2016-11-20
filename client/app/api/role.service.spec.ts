/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RoleService } from './role.service';

describe('Service: Role', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoleService]
    });
  });

  it('should ...', inject([RoleService], (service: RoleService) => {
    expect(service).toBeTruthy();
  }));
});
