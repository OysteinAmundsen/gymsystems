import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { UserService } from 'app/shared/services/api';
import { Role } from 'app/model';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(protected router: Router, protected userService: UserService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.userService.currentUser;
    const role: Role = route.data['role'] as Role || Role.Admin;
    if (currentUser) {
      return currentUser.role >= role;
    }
    this.router.navigate(['/login'], { queryParams: { u: state.url } });
    return false;
  }
}
