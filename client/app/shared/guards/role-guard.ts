import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { UserService } from 'app/services/api';
import { Role } from 'app/services/model/IUser';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(protected router: Router, protected userService: UserService) {  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const me = this;
    const role: Role = route.data['role'] as Role || Role.Admin;
    let subscription: Subscription;
    return new Promise(resolve => {
      subscription = this.userService.getMe().subscribe(user => {
        if (user !== undefined) {     // Since this is a ReplaySubject, first response is always undefined
          if (user == null) {         // This route requires a logged in user role. Redirect to login
            resolve(false);
            this.router.navigate(['/login'], { queryParams: { u: encodeURIComponent(window.location.pathname) } });
          } else {                   // We have a user. Now check role
            resolve(user.role >= role);
            if (user.role < role) { this.router.navigate(['/']); }
          }
          // Cleanup! No need to continue to listen for user after route granted/denied
          setTimeout(() => {
            if (subscription) { subscription.unsubscribe(); }
          });
        }
      });
    });
  }
}
