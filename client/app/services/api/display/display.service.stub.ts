import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/of';

import { DisplayService } from './display.service';

@Injectable()
export class DisplayServiceStub extends DisplayService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAll(tournamentId: number) {
    return Observable.of(null);
  }

  getDisplay(tournamentId: number, displayId: number) {
    return Observable.of(null);
  }
}
