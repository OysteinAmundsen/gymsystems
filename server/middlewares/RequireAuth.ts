import { ForbiddenError, Middleware, MiddlewareInterface, UnauthorizedError } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';

import { Role, User } from '../model/User';

export class AuthMiddlewareBase {
  /*
   * Checks if we have an authorized user in session
   * If not, returns HTTP 401
   */
  protected isLoggedIn(req: any, res: any, next?: (err?: any) => any): boolean {
    if (!req.session || !req.session.passport || !req.session.passport.user || !req.session.passport.user.id) {
      res.status(401).json({message: 'You have to login first!'});
      return false;
    }
    return true;
  }

  /*
   * Checks if the session user has a specific role
   * If not, return HTTP 403
   */
  protected hasRole(req: any, res: any, role: Role, next?: (err?: any) => any): any {
    if (this.isLoggedIn(req, res, next)) { // First check if we are logged in
      if (req.session.passport.user.role >= role) { // Users role must be greater than or equal to requested
        res.status(403).json({message: 'Not authorized for this function'});
      }
      else { return true; }
    }
    return false; // Not even logged in
  }
}

/**
 * Prevent access of not logged user to the routes guarded by this middleware.
 */
@Middleware()
export class RequireAuth extends AuthMiddlewareBase implements MiddlewareInterface {
  public use(req: any, res: any, next?: (err?: any) => any): any {
    if (this.isLoggedIn(req, res, next) && next) { next(); }
  }
}

@Middleware()
export class RequireRoleAdmin extends AuthMiddlewareBase {
  public use(req: any, res: any, next?: (err?: any) => any): any {
    if (this.hasRole(req, res, Role.Admin, next) && next) { next(); }
  }
}

@Middleware()
export class RequireRoleSecretariat extends AuthMiddlewareBase {
  public use(req: any, res: any, next?: (err?: any) => any): any {
    if (this.hasRole(req, res, Role.Secretariat, next) && next) { next(); }
  }
}

@Middleware()
export class RequireRoleClub extends AuthMiddlewareBase {
  public use(req: any, res: any, next?: (err?: any) => any): any {
    if (this.hasRole(req, res, Role.Club, next) && next) { next(); }
  }
}
