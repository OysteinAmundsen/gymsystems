import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';

import * as moment from 'moment';
import Moment = moment.Moment;

import { ITournament } from '../model/ITournament';

@Injectable()
export class TournamentService {
  private url = '/api/tournaments';
  selected: ITournament;

  constructor(private http: Http) {  }

  all(): Observable<ITournament[]> {
    return this.http.get(this.url).map((res: Response) => this.mapDates(res.json())).share();
  }
  past(): Observable<ITournament[]> {
    return this.http.get(`${this.url}/past`).map((res: Response) => this.mapDates(res.json())).share();
  }
  current(): Observable<ITournament[]> {
    return this.http.get(`${this.url}/current`).map((res: Response) => this.mapDates(res.json())).share();
  }
  upcoming(): Observable<ITournament[]> {
    return this.http.get(`${this.url}/future`).map((res: Response) => this.mapDates(res.json())).share();
  }
  getById(id: number): Observable<ITournament> {
    return this.http.get(`${this.url}/${id}`).map((res: Response) => this.mapDate(res.json())).share();
  }

  save(tournament: ITournament) {
    const call = (tournament.id) ? this.http.put(`${this.url}/${tournament.id}`, tournament) : this.http.post(this.url, tournament);
    return call.map((res: Response) => res.json());
  }

  delete(tournament: ITournament) {
    return this.http.delete(`${this.url}/${tournament.id}`);
  }

  mapDate(tournament: ITournament) {
    tournament.startDate = new Date(<string>tournament.startDate);
    tournament.endDate = new Date(<string>tournament.endDate);
    return tournament;
  }

  private mapDates(tournaments: ITournament[]) {
    return tournaments.map(tournament => this.mapDate(tournament));
  }
}
