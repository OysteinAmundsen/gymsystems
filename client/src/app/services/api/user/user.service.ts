import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Logger } from 'app/services';
import { IUser } from 'app/model';
import { Helper } from '../Helper';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _isLoadingUser = false;
  private _$currentUserObservable = new BehaviorSubject<IUser>(JSON.parse(sessionStorage.getItem('currentUser')));
  public get currentUser(): IUser { return this._$currentUserObservable.getValue(); }

  constructor(private http: HttpClient) { }

  // AUTH functions
  /**
   *
   */
  private currentUserReceived(response: HttpResponse<IUser>) {
    this._isLoadingUser = false;

    // Set current user
    const user = response ? response.body : null;
    if (JSON.stringify(this.currentUser) !== JSON.stringify(user)) {
      Logger.debug('%c** Changing user to', 'font-size: 1.1em; font-weight: bold; color: green', user);
      this._$currentUserObservable.next(user);
      sessionStorage.removeItem('currentUser');
    }

    // Store token from header
    if (response && response.headers && response.headers.has('Authorization')) {
      this.tokenReceived(response.headers.get('Authorization'), parseInt(response.headers.get('expiration'), 10));
    }

    return this.currentUser;
  }

  tokenReceived(token: string, expiration: number) {
    if (this.currentUser) {
      this.currentUser.token = token;
      this.currentUser.expire = expiration;
      sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }
  }

  /**
   *
   */
  private _loadMeInternal() {
    return this.http.get<IUser>('/api/user/me', { headers: { 'noCache': 'true' }, observe: 'response' })
      .pipe(
        map((res: HttpResponse<IUser>) => this.currentUserReceived(res)),
        catchError((err: Response) => {
          this.currentUserReceived(null);
          return throwError(err);
        })
      );
  }

  /**
   *
   */
  getMe(): Observable<IUser> {
    if (!this.currentUser && !this._isLoadingUser) {
      this._isLoadingUser = true; // Prevent loading if load allready initiated
      this._loadMeInternal().subscribe();
    }
    return this._$currentUserObservable;
  }

  // Standard REST api functions
  /**
   *
   */
  all(): Observable<IUser[]> {
    return this.http.get<IUser[]>('/api/user');
  }

  /**
   *
   */
  getById(id: number): Observable<IUser> {
    return this.http.get<IUser>('/api/user/' + id);
  }

  /**
   *
   */
  save(user: IUser): Observable<IUser> {
    return (user.id
      ? this.http.put<IUser>(`/api/user/${user.id}`, Helper.reduceLevels(user))
      : this.http.post<IUser>('/api/user/', user));
  }

  /**
   *
   */
  register(user: IUser): Observable<IUser> {
    return this.http.post<IUser>('/api/user/register', Helper.reduceLevels(user));
  }

  /**
   *
   */
  delete(user: IUser) {
    return this.http.delete(`/api/user/${user.id}`);
  }

  /**
   *
   */
  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post<IUser>('/api/user/login', credentials, { observe: 'response' })
      .pipe(map((res: HttpResponse<IUser>) => this.currentUserReceived(res)));
  }

  /**
   *
   */
  logout() {
    return this.http.post('/api/user/logout', {})
      .pipe(map((res: Response) => {
        return this.currentUserReceived(null);
      }));
  }
}
