import { Request, Response } from 'express';
import { Container } from 'typedi';

import { Logger } from '../utils/Logger';

import { Role, User } from '../model/User';
import { BelongsToClub, Club } from '../model/Club';
import { ClubController } from '../controllers/ClubController';
import { UserController } from '../controllers/UserController';
import { ErrorResponse } from '../utils/ErrorResponse';

/**
 * Turning club strings into persisted club objects
 */
export function validateClub(obj: BelongsToClub, oldObj?: BelongsToClub, req?: Request, noCreate = false): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const clubRepository = Container.get(ClubController);
    const me = await Container.get(UserController).me(req);
    let clubChanged = false;

    if (!obj.club) {
      return resolve('No club entered');
    }

    if (typeof obj.club === 'string') {
      if (oldObj && oldObj.club && oldObj.club.id) {
        // Allready has a club
        if (oldObj.club.name !== obj.club) {
          // Club name changed
          oldObj.club.name = obj.club;
          obj.club = oldObj.club;
          clubChanged = true;
        } else {
          obj.club = oldObj.club;
        }
      } else {
        // No previous club, and club given is string. Auto convert string to object
        // Use only match if name is exactly equal
        const clubs: Club[] = await clubRepository.all(req, obj.club);
        const club = clubs[0];
        obj.club = (!club || club.name !== obj.club
          ? <Club>{id: null, name: obj.club, troops: null, teams: null, tournaments: null, gymnasts: null, users: null}
          : club);
      }
    }

    if (obj.club.id && me && !(me.role >= Role.Admin || obj.club.id === me.club.id)) {
      return resolve(`You do not have the privileges to modify data for clubs that aren't your own.`);
    } else if (!noCreate && (
         (clubChanged && me && me.role >= Role.Admin)      // Club changed. We are logged in as Admin.
      || (clubChanged && me && obj.club.id === me.club.id) // Club changed. We are logged in as club member
      || (!obj.club.id && me && me.role >= Role.Admin)     // New club. We are logged in as Admin
      || (!obj.club.id && !me))) {                         // New club. We are not logged in (assuming new user registration)
      // New or updated club received. We need to persist it
      const resp = await clubRepository.create(obj.club);
      if (resp instanceof ErrorResponse) {
        return resolve(`Club cannot be modified: ${resp.message}`);
      }
      obj.club = resp;
    } else if (!obj.club.id) {
      return resolve(`Club not found and could not be created.`);
    }

    resolve();
  });
}
