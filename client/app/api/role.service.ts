import { Injectable } from '@angular/core';

import { UserService } from './user.service';

@Injectable()
export class RoleService {
  constructor(private userService: UserService) { }
}
