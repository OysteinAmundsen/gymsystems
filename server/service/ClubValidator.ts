import { Container } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { Role, User } from '../model/User';
import { BelongsToClub, Club } from '../model/Club';
import { ClubController } from '../controllers/ClubController';
import { UserController } from '../controllers/UserController';

export async function validateClub(body: BelongsToClub[]): Promise<boolean> {
  const clubRepository = Container.get(ClubController);
  for (let j = 0; j < body.length; j++) {
    const obj = body[j];

    // Auto convert string to object
    if (typeof obj.club === 'string') {
      const club: Club[] = await clubRepository.all(null, obj.club);
      if (club.length === 1) {
        obj.club = club[0];
      } else {
        return false;
      }
    }
  }

  return true;
}

export async function isMyClub(body: BelongsToClub[], req: Request): Promise<boolean> {
  const userRepository = Container.get(UserController);
  const me = await userRepository.me(req);

  return body.every(b => {
    return (b.club && b.club.id === me.club.id) || me.role > Role.Admin;
  });
}
