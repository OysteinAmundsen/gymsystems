import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/of';

import { IClub, IGymnast } from 'app/services/model';

@Injectable()
export class ClubServiceStub {

  constructor(private http: Http) { }

  all(): Observable<IClub[]> {
    return Observable.of(null);
  }
  findByName(name: string): Observable<IClub[]> {
    return Observable.of(null);
  }
  getById(id: number): Observable<IClub> {
    return Observable.of(null);
  }
  createClubFromName(name: string) {
    return Observable.of(null);
  }
  saveClub(club: IClub) {
    return Observable.of(null);
  }

  getMembers(id: number): Observable<IGymnast[]> {
    return Observable.of(null);
  }
}
