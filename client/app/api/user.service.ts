import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';

import { ApiService } from './ApiService';
import { IUser, User } from './model/IUser';
import { IRole, Role } from './model/IRole';
import { IDiscipline } from './model/IDiscipline';

@Injectable()
export class UserService extends ApiService {
  _currentUser: IUser = User.Anonymous;
  get current(): IUser { return this._currentUser; }
  set current(user: IUser) { this._currentUser = user; }

  constructor(private http: Http) {
    super();
  }

  all(): Observable<IUser[]> {
    return this.http.get('/api/users').map((res: Response) => res.json()).share().catch(this.handleError);
  }

  filterByName(name: string): Observable<IUser[]> {
    return this.http.get('/api/users?$filter=' + name).map((res: Response) => res.json()).share().catch(this.handleError);
  }

  filterByRole(role: IRole): Observable<IUser[]> {
    return this.http.get('/api/users?$role=' + role.name).map((res: Response) => res.json()).share().catch(this.handleError);
  }

  getById(id: number): Observable<IUser> {
    return this.http.get('/api/users/' + id).map((res: Response) => res.json()).share().catch(this.handleError);
  }
}
