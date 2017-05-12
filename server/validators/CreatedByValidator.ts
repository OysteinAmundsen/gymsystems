import { Container } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { UserController } from '../controllers/UserController';
import { CreatedBy, Role } from '../model/User';

export async function isCreatedByMe(obj: CreatedBy, req: Request): Promise<boolean> {
  const userRepository = Container.get(UserController);
  const me = await userRepository.me(req);

  return  (obj.createdBy.id === me.id || me.role >= Role.Admin);
}

export async function isSameClubAsMe(obj: CreatedBy, req: Request): Promise<boolean> {
  const userRepository = Container.get(UserController);
  const me = await userRepository.me(req);

  return (obj.createdBy.club.id === me.club.id || me.role >= Role.Admin);
}

export async function isAllSameClubAsMe(obj: CreatedBy[], req: Request): Promise<boolean> {
  const userRepository = Container.get(UserController);
  const me = await userRepository.me(req);

  return (obj.every(p => (p.createdBy.club.id === me.club.id || me.role >= Role.Admin)));
}
