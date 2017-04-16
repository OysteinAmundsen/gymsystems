import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/of';

import { IUser } from './model/IUser';
import { IDiscipline } from './model/IDiscipline';
// import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  _currentUser: IUser;
  get current(): IUser { return this._currentUser; }
  set current(user: IUser) { this._currentUser = user; }

  constructor(private http: Http) {  }

  all(): Observable<IUser[]> {
    return this.http.get('/api/users').map((res: Response) => res.json()).share();
  }

  getById(id: number): Observable<IUser> {
    return this.http.get('/api/users/' + id).map((res: Response) => res.json()).share();
  }

  private userReceived(res: Response) {
    this.current = res.json();
    return this.current;
  }

  getMe(): Observable<IUser> {
    if (this.current) { return Observable.of(this.current); }
    return this.http.get('/api/users/me')
      .map((res: Response) => this.userReceived(res))
      .share()
      .catch((err: Response) => Observable.of(null));
  }

  login(credentials: { username: string, password: string }): Observable<any> {
    // credentials.password = bcrypt.hashSync(credentials.password, bcrypt.genSaltSync(10));

    return this.http.post('/api/users/login', credentials)
      .map((res: Response) => this.userReceived(res))
      ;
  }
}
