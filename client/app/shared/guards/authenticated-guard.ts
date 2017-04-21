import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { UserService } from 'app/api';

@Injectable()
export class AuthenticatedGuard implements CanActivate {

  currentUser;

  constructor(protected router: Router, protected userService: UserService) {  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const me = this;
    return new Promise(resolve => {
      this.userService.getMe().subscribe(user => {
        if (user !== undefined) { // Since this is a ReplaySubject, first response is always undefined
          this.redirect(resolve, (user != null)); // Second is always either a user or `null`
        }
      });
    });
  }

  protected hasRole(role) {
    const me = this;
    return new Promise(resolve => {
      this.userService.getMe().subscribe(user => {
        if (user !== undefined) { // Since this is a ReplaySubject, first response is always undefined
          user == null ? me.redirect(resolve, false) : resolve(user.role >= role);
        }
      });
    });
  }

  private redirect(resolve, flag) {
    if (!flag) {
      this.router.navigate(['/login'], { queryParams: { u: encodeURIComponent(window.location.pathname) } });
    }
    resolve(flag);
    return flag;
  }
}
