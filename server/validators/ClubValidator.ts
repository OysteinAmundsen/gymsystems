import { Container } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { Logger } from '../utils/Logger';

import { Role, User } from '../model/User';
import { BelongsToClub, Club } from '../model/Club';
import { ClubController } from '../controllers/ClubController';
import { UserController } from '../controllers/UserController';

export async function lookupOrFakeClub(obj: BelongsToClub, req?: Request): Promise<Club> {
  const clubRepository = Container.get(ClubController);
  if (typeof obj.club === 'string') {
    // Auto convert string to object
    const club: Club[] = await clubRepository.all(req, obj.club);
    return club[0];
  }
  return obj.club;
}

export async function validateClub(body: BelongsToClub[], req?: Request): Promise<boolean> {
  for (let j = 0; j < body.length; j++) {
    const obj = body[j];
    const club = await lookupOrFakeClub(obj, req);
    if (club && club.id) {
      obj.club = club;
    } else {
      Logger.log.error(`No club with name "${obj.club}" found`);
      return false;
    }
  }
  Logger.log.debug(JSON.stringify(body));
  return true;
}

export async function isMyClub(body: BelongsToClub[], req: Request): Promise<boolean> {
  const userRepository = Container.get(UserController);
  const me = await userRepository.me(req);

  return body.every(b => {
    return me.role >= Role.Admin || (b.club && b.club.id === me.club.id);
  });
}
