import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { UserService } from 'app/api';
import { Role } from 'app/api/model/IUser';

@Injectable()
export class AuthenticatedGuard implements CanActivate {

  currentUser;

  constructor(protected router: Router, protected userService: UserService) {
    this.userService.getMe().subscribe(user => this.currentUser = user);
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const me = this;
    return new Promise(resolve => {
      // User not found. Go to login
      me.redirect(resolve, (this.currentUser != null));
    });
  }

  protected hasRole(role) {
    const me = this;
    return new Promise(resolve => {
      if (me.currentUser == null) { // User not found. Go to login
        me.redirect(resolve, false);
      }
      else { // User found, but not privileged. Just reject route.
        resolve(me.currentUser.role >= role);
      }
    });
  }

  private redirect(resolve, flag) {
    if (!flag) {
      this.router.navigate(['/login'], { queryParams: { u: encodeURIComponent(window.location.pathname) } });
    }
    resolve(flag);
  }
}
