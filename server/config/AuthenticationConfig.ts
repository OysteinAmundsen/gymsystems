import { Express, Request, Response, NextFunction } from 'express';
import passport = require('passport');
import * as auth from 'passport';
import * as LocalStrategy from 'passport-local';

import { getConnectionManager, Connection, Repository } from 'typeorm';
import { Container, Service } from 'typedi';
import * as bcrypt from 'bcrypt';

import { User } from '../model/User';
import { IVerifyOptions } from 'passport-local';

/**
 * Configure `Passport` authentication strategies for our application
 *
 * @param {Express} app
 * @param {Passport} passport
 */
export function setupAuthentication(app: Express): auth.Passport {
  // Configure passport strategies
  passport.use('local-login', new LocalStrategy.Strategy({
    // Strategy options
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },// Verify function with request
    (req: Request, username: string, password: string, done: (error: any, user?: any, options?: IVerifyOptions) => void) => {
      const userRepository: Repository<User> = getConnectionManager().get().getRepository(User);
      userRepository.findOne({ name: username })
        .then(user => {
          if (!user) { done('No user found.', null, { message: 'No user found'}); }
          else if (!bcrypt.compareSync(password, user.password)) {
            done('Password mismatch', null, { message: 'Password mismatch'});
          } else {
            done(null, user);
          }
        })
        .catch(err => done(err));
    }
  ));

  // Methods for serializing/deserializing the user object
  passport.serializeUser((user: any, done: Function) => done(null, user));
  passport.deserializeUser((id: number, done: Function) => done(null, { name: 'test', id: 1 }));

  Container.set(auth.Passport, passport);

  // Apply passport to Express container
  app
    .use(passport.initialize())                     // Passport
    .use(passport.session());

  return passport;
}
