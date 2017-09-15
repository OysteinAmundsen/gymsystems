import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Logger } from 'app/services';
import { Helper } from '../Helper';

import { IVenue, ITournament } from 'app/model';
import { VenueService } from './venue.service';

@Injectable()
export class VenueServiceStub extends VenueService {

  constructor(http: HttpClient) {
    super(http);
  }

  // Standard REST api functions
  all(): Observable<IVenue[]> {
    return Observable.of(null);
  }

  getByTournament(tournament: ITournament): Observable<IVenue> {
    return Observable.of(null);
  }

  getById(id: number): Observable<IVenue> {
    return Observable.of(null);
  }

  save(venue: IVenue): Observable<IVenue> {
    return Observable.of(null);
  }

  delete(venue: IVenue) {
    return Observable.of(null);
  }
}
