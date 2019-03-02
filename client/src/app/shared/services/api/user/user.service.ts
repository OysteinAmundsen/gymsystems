import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Logger } from 'app/shared/services';
import { IUser } from 'app/model';
import { GraphService } from 'app/shared/services/graph.service';
import { BrowserService } from 'app/shared/browser.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _isLoadingUser = false;
  private _$currentUserObservable = new BehaviorSubject<IUser>(JSON.parse(this.browser.sessionStorage().getItem('currentUser')));
  public get currentUser(): IUser { return this._$currentUserObservable.getValue(); }

  constructor(private http: HttpClient, private graph: GraphService, private browser: BrowserService) { }

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
      this.browser.sessionStorage().removeItem('currentUser');
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
      this.browser.sessionStorage().setItem('currentUser', JSON.stringify(this.currentUser));
    }
  }

  /**
   *
   */
  private _loadMeInternal(noReport?: boolean) {
    const options = {};
    if (noReport) { options['context'] = { headers: { noReport: true } }; }
    return this.graph.get(`{me {id, name, role, email, club {id, name}}}`, options)
      .pipe(map(res => this.currentUserReceived(res.me)),
        catchError(err => {
          this.currentUserReceived(null);
          return throwError(err);
        })
      );
  }

  /**
   *
   */
  getMe(noReport?: boolean): Observable<IUser> {
    if (!this.currentUser && !this._isLoadingUser) {
      this._isLoadingUser = true; // Prevent loading if load allready initiated
      this._loadMeInternal(noReport).subscribe();
    }
    return this._$currentUserObservable;
  }

  // Standard REST api functions
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
    return of(this.currentUserReceived(null));
  }
}
