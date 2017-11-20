import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import { Logger } from 'app/services';
import { IUser } from 'app/model';
import { Helper } from '../Helper';

@Injectable()
export class UserService {
  private _isLoadingUser = false;
  private _meObservable = new ReplaySubject<IUser>(1);
  private _currentUser: IUser;
  private _recheck;
  public get currentUser(): IUser { return this._currentUser; }

  constructor(private http: HttpClient) {  }

  // AUTH functions
  private userReceived(user: IUser) {
    this._isLoadingUser = false;
    if (JSON.stringify(this._currentUser) !== JSON.stringify(user)) {
      Logger.debug('%c** Changing user to', 'font-size: 1.1em; font-weight: bold; color: green', user);
      this._currentUser = user;
      this._meObservable.next(user);
    }
    if (this._recheck) { clearTimeout(this._recheck); }
    if (user) {
      // Set to recheck auth after 10 minutes. Will return null if users session has expired.
      this._recheck = setTimeout(() => this._loadMeInternal().subscribe(), 10 * 60 * 1000);
    }

    return this.currentUser;
  }

  private _loadMeInternal() {
    return this.http.get<IUser>('/api/users/me')
      .map((res: IUser) => this.userReceived(res))
      .catch((err: Response) =>  {
        this.userReceived(null);
        return Observable.throw(err);
      });
  }

  getMe(): Observable<IUser> {
    if (this.currentUser === undefined && !this._isLoadingUser) {
      this._isLoadingUser = true; // Prevent loading if load allready initiated
      this._loadMeInternal().subscribe();
    }
    return this._meObservable.asObservable();
  }

  // Standard REST api functions
  all(): Observable<IUser[]> {
    return this.http.get<IUser[]>('/api/users');
  }

  getById(id: number): Observable<IUser> {
    return this.http.get<IUser>('/api/users/get/' + id);
  }

  save(user: IUser): Observable<IUser> {
    return (user.id
      ? this.http.put<IUser>(`/api/users/${user.id}`, Helper.reduceLevels(user))
      : this.http.post<IUser>('/api/users/', user));
  }

  register(user: IUser): Observable<IUser> {
    return this.http.post<IUser>('/api/users/register', Helper.reduceLevels(user));
  }

  delete(user: IUser) {
    return this.http.delete(`/api/users/${user.id}`);
  }

  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post<IUser>('/api/users/login', credentials)
      .map((res: IUser) => this.userReceived(res));
  }

  logout() {
    return this.http.post('/api/users/logout', {})
      .map((res: Response) => {
        return this.userReceived(null);
      });
  }
}
