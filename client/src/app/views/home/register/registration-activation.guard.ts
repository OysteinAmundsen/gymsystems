import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from 'app/shared/interceptors/error-handler.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class CanActivateRegistration implements CanActivate {
  constructor(private error: ErrorHandlerService, private translate: TranslateService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!environment.allowRegistrations) {
      this.error.setError(this.translate.instant('We are currently not accepting any registrations into this system. You have to ask an existing member for access.'), this.translate.instant('Registration is closed'));
      return false;
    };
    return true;
  }
}
