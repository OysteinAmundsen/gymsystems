import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { IUser, Role, IClub } from 'app/model';
import { UserService } from 'app/services/api';
import { dummyClub } from 'app/services/api/club/club.service.stub';

export const dummyAdmin: IUser = <IUser>{
  id    : 0,
  name  : 'admin',
  email : 'admin@admin.no',
  role  : Role.Admin,
  club  : dummyClub
};

export const dummyOrganizer: IUser = <IUser>{
  id    : 0,
  name  : 'organizer',
  email : 'organizer@admin.no',
  role  : Role.Organizer,
  club  : dummyClub
};

export const dummyClubRep: IUser = <IUser>{
  id    : 0,
  name  : 'club',
  email : 'club@admin.no',
  role  : Role.Club,
  club  : dummyClub
};

@Injectable()
export class UserServiceStub extends UserService {
  club: IClub = dummyClub
  user: IUser = dummyAdmin;

  constructor(http: HttpClient) {
    super(http);
  }

  getMe(): Observable<IUser> {
    return Observable.of(this.user);
  }

  // Standard REST api functions
  all(): Observable<IUser[]> {
    return Observable.of([this.user]);
  }

  getById(id: number): Observable<IUser> {
    return Observable.of(this.user);
  }

  save(user: IUser): Observable<IUser> {
    return Observable.of(null);
  }

  register(user: IUser): Observable<IUser> {
    return Observable.of(this.user);
  }

  delete(user: IUser) {
    return Observable.of(null);
  }

  login(credentials: { username: string, password: string }): Observable<any> {
    return Observable.of(this.user);
  }

  logout() {
    return Observable.of(null);
  }
}
