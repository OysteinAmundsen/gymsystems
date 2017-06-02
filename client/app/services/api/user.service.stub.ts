import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import { IUser, Role } from '../model/IUser';
import { IClub } from 'app/services/model/IClub';

@Injectable()
export class UserServiceStub {
  club: IClub = <IClub>{
    id  : 0,
    name: 'HAUGESUND TURNFORENING'
  }
  user: IUser = <IUser>{
    id    : 0,
    name  : 'admin',
    email : 'admin@admin.no',
    role  : Role.Admin,
    club  : this.club
  };

  constructor(private http: Http) {  }

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
