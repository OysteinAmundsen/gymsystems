import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { IUser, User } from './model/IUser';
import { IRole, Role } from './model/IRole';
import { IDiscipline } from './model/IDiscipline';

@Injectable()
export class UserService {
  _currentUser: IUser = User.Anonymous;
  get current(): IUser { return this._currentUser; }
  set current(user: IUser) { this._currentUser = user; }

  constructor(private http: Http) { }

  all(): Observable<IUser[]> {
    return this.http.get('/api/users').map(this.extractResult).catch(this.handleError);
  }

  filterByName(name: string): Observable<IUser[]> {
    return this.http.get('/api/users?$filter=' + name).map(this.extractResult).catch(this.handleError);
  }

  filterByRole(role: IRole): Observable<IUser[]> {
    return this.http.get('/api/users?$role=' + role.name).map(this.extractResult).catch(this.handleError);
  }

  getById(id: number): Observable<IUser> {
    return this.http.get('/api/users/' + id).map(this.extractResult).catch(this.handleError);
  }

  private extractResult(res: Response) {
    const body = res.json();
    return body.data || {};
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
