import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { UserService } from 'app/services/api';
import { Role } from 'app/model';

@Injectable()
export class RoleGuard implements CanActivate {
  currentUser;
  constructor(protected router: Router, protected userService: UserService) {
    this.userService.getMe().subscribe(user => {
      if (this.currentUser && !user) { // User was present, but no more
        this.login();
      }
      this.currentUser = user;
    });
  }

  private login() {
    this.router.navigate(['/login'], { queryParams: { u: encodeURIComponent(window.location.pathname) } });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> {
    const me = this;
    const role: Role = route.data['role'] as Role || Role.Admin;
    return new Promise(resolve => {
      if (this.currentUser !== undefined) {
        resolve(this.currentUser != null && this.currentUser.role >= role);

        if (!this.currentUser || (this.currentUser && this.currentUser.role < role)) {
          this.login();
        }
      }
    });
  }
}
