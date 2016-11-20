import { UserService } from './user.service';
import { Injectable } from '@angular/core';

@Injectable()
export class RoleService {
  constructor(private userService: UserService) { }
}
