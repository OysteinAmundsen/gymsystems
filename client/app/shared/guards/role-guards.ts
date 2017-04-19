import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticatedGuard } from 'app/shared/guards/authenticated-guard';
import { UserService } from 'app/api';
import { Role } from 'app/api/model/IUser';

@Injectable()
export class RoleAdminGuard extends AuthenticatedGuard implements CanActivate {
  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!super.canActivate(route, state)) { return false; }
    return super.hasRole(Role.Admin);
  }
}

@Injectable()
export class RoleSecretariatGuard extends AuthenticatedGuard implements CanActivate {
  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!super.canActivate(route, state)) { return false; }
    return super.hasRole(Role.Secretariat);
  }
}

@Injectable()
export class RoleClubGuard extends AuthenticatedGuard implements CanActivate {
  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!super.canActivate(route, state)) { return false; }
    return super.hasRole(Role.Club);
  }
}

@Injectable()
export class RoleUserGuard extends AuthenticatedGuard implements CanActivate {
  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!super.canActivate(route, state)) { return false; }
    return super.hasRole(Role.User);
  }
}
