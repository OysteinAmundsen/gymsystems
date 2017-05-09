import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/of';

import { IClub } from '../model/IClub';

@Injectable()
export class ClubServiceStub {

  constructor(private http: Http) { }

  findByName(name: string): Observable<IClub[]> {
    return Observable.of(null);
  }

  saveClub(name: string) {
    return Observable.of(null);
  }
}
