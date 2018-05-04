import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of} from 'rxjs';

import { DisplayService } from './display.service';

@Injectable()
export class DisplayServiceStub extends DisplayService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAll(tournamentId: number) {
    return of(null);
  }

  getDisplay(tournamentId: number, displayId: number) {
    return of(null);
  }
}
