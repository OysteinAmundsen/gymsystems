import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Logger } from 'app/services';
import { Helper } from '../Helper';

import { IVenue, ITournament } from 'app/model';

@Injectable()
export class VenueService {

  constructor(private http: Http) { }

  // Standard REST api functions
  all(): Observable<IVenue[]> {
    return this.http.get('/api/venue').map((res: Response) => res.json()).share();
  }

  getByTournament(tournament: ITournament): Observable<IVenue> {
    return this.http.get('/api/venue/tournament/' + tournament.id).map((res: Response) => res.json()).share();
  }

  getById(id: number): Observable<IVenue> {
    return this.http.get('/api/venue/' + id).map((res: Response) => res.json()).share();
  }

  save(venue: IVenue): Observable<IVenue> {
    return (venue.id
      ? this.http.put(`/api/venue/${venue.id}`, Helper.reduceLevels(venue))
      : this.http.post('/api/venue/', venue))
      .map((res: Response) => res.json());
  }

  delete(venue: IVenue) {
    return this.http.delete(`/api/venue/${venue.id}`);
  }
}
