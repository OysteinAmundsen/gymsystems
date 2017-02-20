import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { IRole, Role, IDiscipline } from './model';

// User type interfaces
export interface IUser {
  name: string;
  password: string;
  role?: IRole;
}
export interface IJudgeUser extends IUser {
  disciplines: IDiscipline[];
  type: JudgeType;
}
export interface ITrainerUser extends IUser {
}

// User type implementations
export class User implements IUser {
  public static Anonymous: User = new User('Admin', null, Role.System); // Anonymous); //
  constructor(public name: string, public password: string, public role?: IRole) { }
}
export class Judge extends User implements IJudgeUser {
  constructor(
    public name: string,
    public password: string,
    public role: IRole,
    public disciplines: IDiscipline[],
    public type: JudgeType
  ) {
    super(name, password, role);
  }
}
export enum JudgeType {
  Execution,
  Difficulty,
  Composition
}
export class Trainer extends User implements ITrainerUser {
  static mapTo(json: ITrainerUser | ITrainerUser[]): Trainer | Trainer[] {
    if (Array.isArray(json)) {
      return json.map((item: ITrainerUser) => new Trainer(item.name, item.password, <Role>Role.mapTo(item.role)));
    } else {
      return new Trainer(json.name, json.password, <Role>Role.mapTo(json.role));
    }
  }
  constructor(
    public name: string,
    public password: string,
    public role: IRole
  ) {
    super(name, password, role);
  }
}

// User service
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
    let body = res.json();
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
