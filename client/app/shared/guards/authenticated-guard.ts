import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from 'app/api';
import { Role } from 'app/api/model/IUser';

@Injectable()
export class AuthenticatedGuard implements CanActivate {

  constructor(protected router: Router, protected userService: UserService) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const me = this;
    return new Promise(resolve => {
      this.userService.getMe().subscribe(user => {
        me.redirect(resolve, (user != null));
      });
    });
  }

  protected hasRole(role) {
    const me = this;
    return new Promise(resolve => {
      this.userService.getMe().subscribe(
        user => me.redirect(resolve, (user != null && user.role >= role)),
        err => me.redirect(resolve, false)
      );
    });
  }

  private redirect(resolve, flag) {
    if (!flag) { this.router.navigate(['/login']); }
    resolve(flag);
  }
}
