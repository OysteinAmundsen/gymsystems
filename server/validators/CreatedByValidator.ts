import { Container } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { UserController } from '../controllers/UserController';
import { CreatedBy, Role } from '../model/User';

export async function isCreatedByMe(obj: CreatedBy, req: Request): Promise<boolean> {
  const userRepository = Container.get(UserController);
  const me = await userRepository.me(req);

  return  (me.role >= Role.Admin || obj.createdBy.id === me.id);
}

export async function isSameClubAsMe(obj: CreatedBy, req: Request): Promise<boolean> {
  const userRepository = Container.get(UserController);
  const me = await userRepository.me(req);

  return (me.role >= Role.Admin || obj.createdBy.club.id === me.club.id);
}

export async function isAllSameClubAsMe(obj: CreatedBy[], req: Request): Promise<boolean> {
  const userRepository = Container.get(UserController);
  const me = await userRepository.me(req);

  return (obj.every(p => (me.role >= Role.Admin || p.createdBy.club.id === me.club.id)));
}
