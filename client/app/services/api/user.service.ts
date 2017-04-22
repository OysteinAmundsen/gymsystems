import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import { IUser } from '../model/IUser';
import { IDiscipline } from '../model/IDiscipline';

@Injectable()
export class UserService {

  _isLoadingMe: boolean = false;
  _meObservable = new ReplaySubject(1);
  _currentUser: IUser;
  private get currentUser(): IUser { return this._currentUser; }
  private set currentUser(user: IUser) {
    this._currentUser = user;
    this._meObservable.next(user);
  }

  constructor(private http: Http) {  }

  all(): Observable<IUser[]> {
    return this.http.get('/api/users').map((res: Response) => res.json()).share();
  }

  getById(id: number): Observable<IUser> {
    return this.http.get('/api/users/get/' + id).map((res: Response) => res.json()).share();
  }

  private userReceived(res: Response) {
    this._isLoadingMe = false;
    this.currentUser = res instanceof Response ? res.json() : res;
    return this.currentUser;
  }

  getMe(): Observable<IUser> {
    if (!this.currentUser && !this._isLoadingMe) {
      this._isLoadingMe = true; // Prevent loading if load allready initiated
      this.http.get('/api/users/me')
        .map((res: Response) => this.userReceived(res))
        .catch((err: Response) =>  {
          this.userReceived(null);
          return Observable.throw(err);
        })
        .subscribe();
    }
    return this._meObservable;
  }

  save(user: IUser): Observable<IUser> {
    return (user.id ? this.http.put(`/api/users/${user.id}`, user) : this.http.post('/api/users/', user))
      .map((res: Response) => res.json());
  }

  delete(user: IUser) {
    return this.http.delete(`/api/users/${user.id}`);
  }

  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post('/api/users/login', credentials)
      .map((res: Response) => this.userReceived(res));
  }

  logout() {
    return this.http.post('/api/users/logout', {})
      .map((res: Response) => {
        return this.userReceived(res);
      });
  }
}
