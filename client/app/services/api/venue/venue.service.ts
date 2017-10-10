import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Logger } from 'app/services';
import { Helper } from '../Helper';

import { IVenue, ITournament } from 'app/model';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class VenueService {
  public static apiKey = 'AIzaSyDIYbCDSYzEF6naFvgkjv297hX7cqS3mBs';

  constructor(private http: HttpClient) { }

  // Standard REST api functions
  all(): Observable<IVenue[]> {
    return this.http.get<IVenue[]>('/api/venue');
  }

  getByTournament(tournament: ITournament): Observable<IVenue> {
    return this.http.get<IVenue>('/api/venue/tournament/' + tournament.id);
  }

  getById(id: number): Observable<IVenue> {
    return this.http.get<IVenue>('/api/venue/' + id);
  }

  findByName(name: string): Observable<IVenue[]> {
    return this.http.get<IVenue[]>(`/api/venue/name/${name}`);
  }

  save(venue: IVenue): Observable<IVenue> {
    return (venue.id
      ? this.http.put<IVenue>(`/api/venue/${venue.id}`, Helper.reduceLevels(venue))
      : this.http.post<IVenue>('/api/venue/', venue));
  }

  delete(venue: IVenue) {
    return this.http.delete(`/api/venue/${venue.id}`);
  }

  findLocationByAddress(address: string): Observable<[{}]> {
    // return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${VenueService.apiKey}`);
    return this.http.get<[{}]>(`/api/venue/addr/${address}`);
  }
}
