import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of} from 'rxjs';

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
    return of(null);
  }

  getByTournament(tournament: ITournament): Observable<IVenue> {
    return of(null);
  }

  getById(id: number): Observable<IVenue> {
    return of(null);
  }

  save(venue: IVenue): Observable<IVenue> {
    return of(null);
  }

  delete(venue: IVenue) {
    return of(null);
  }
}
