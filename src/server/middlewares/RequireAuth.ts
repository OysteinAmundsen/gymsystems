import { ForbiddenError, Middleware, ExpressMiddlewareInterface, UnauthorizedError } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';

import { Role, User } from '../model/User';

/**
 * Prevent access of not logged user to the routes guarded by this middleware.
 */
export class RequireAuth implements ExpressMiddlewareInterface {
  public use(req: any, res: any, next?: (err?: any) => any): any {
    if (isLoggedIn(req, res, next) && next) { next(); }
  }
}

/**
 * Validate current users privileges in the system.
 */
export class RequireRole {
  static get(role: Role) {
    return (req: any, res: any, next?: (err?: any) => any): any => {
      if (hasRole(req, res, role, next) && next) {
        next();
      } else {
        next('Not authorized');
      }
    };
  }
}

/*
 * Checks if we have an authorized user in session
 * If not, returns HTTP 401
 */
function isLoggedIn(req: any, res: any, next?: (err?: any) => any): boolean {
  const passport = req.session.passport || req.passport;
  if (!passport || !passport.user || !passport.user.id) {
    res.status(401).json({message: 'You have to login first!'});
    return false;
  }
  return true;
}

/*
 * Checks if the session user has a specific role
 * If not, return HTTP 403
 */
function hasRole(req: any, res: any, role: Role, next?: (err?: any) => any): any {
  if (isLoggedIn(req, res, next)) { // First check if we are logged in
    if (req.session.passport.user.role >= role) { // Users role must be greater than or equal to requested
      return true;
    } else {
      res.status(403).json({message: 'Not authorized for this function'});
    }
  }
  return false; // Not even logged in
}