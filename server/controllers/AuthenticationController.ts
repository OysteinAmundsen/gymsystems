import { getConnectionManager, Repository  } from 'typeorm';
import { JsonController, Get, Post, Put, Delete, EmptyResultCode, Body, Param, Req, Res } from 'routing-controllers';
import { EntityFromParam, EntityFromBody } from 'typeorm-routing-controllers-extensions';
import * as Passport from 'passport';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

/**
 *
 */
@JsonController()
export class AuthenticationController {

  constructor() {
  }

  @Post('/login')
  login() {
    Passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' });
  }
}
