import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from 'app/api';
import { Role } from 'app/api/model/IUser';

@Injectable()
export class AuthenticatedGuard implements CanActivate {

  constructor(protected router: Router, protected userService: UserService) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userService.current != null;
  }

  hasRole(role) {
    if (this.userService.current.role < role) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
