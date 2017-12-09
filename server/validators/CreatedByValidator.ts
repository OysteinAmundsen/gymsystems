import { Container } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { UserController } from '../controllers/UserController';
import { CreatedBy, Role } from '../model/User';
import { BelongsToClub } from '../model/Club';

export async function isCreatedByMe(obj: CreatedBy, req: Request): Promise<boolean> {
  const userRepository = Container.get(UserController);
  const me = await userRepository.getMe(req);

  return  (me.role >= Role.Admin || obj.createdBy.id === me.id);
}

export async function isSameClubAsMe(obj: BelongsToClub, req: Request): Promise<boolean> {
  const userRepository = Container.get(UserController);
  const me = await userRepository.getMe(req);

  return (me.role >= Role.Admin || obj.club.id === me.club.id);
}

export async function isAllSameClubAsMe(obj: BelongsToClub[], req: Request): Promise<boolean> {
  const userRepository = Container.get(UserController);
  const me = await userRepository.getMe(req);

  return (obj.every(p => (me.role >= Role.Admin || p.club.id === me.club.id)));
}
