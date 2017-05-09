import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/of';

@Injectable()
export class DisplayServiceStub {

  constructor(private http: Http) { }

  getAll(tournamentId: number) {
    return Observable.of(null);
  }

  getDisplay(tournamentId: number, displayId: number) {
    return Observable.of(null);
  }
}
