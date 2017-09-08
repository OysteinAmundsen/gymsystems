import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/of';

import { DisplayService } from './display.service';

@Injectable()
export class DisplayServiceStub extends DisplayService {

  constructor(http: Http) {
    super(http);
  }

  getAll(tournamentId: number) {
    return Observable.of(null);
  }

  getDisplay(tournamentId: number, displayId: number) {
    return Observable.of(null);
  }
}
