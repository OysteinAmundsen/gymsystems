import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';

import * as moment from 'moment';

import { ITournament } from 'app/services/model/ITournament';
import { Helper } from '../Helper';

@Injectable()
export class TournamentService {
  private url = '/api/tournaments';
  selected: ITournament;

  constructor(private http: Http) {  }

  all(): Observable<ITournament[]> {
    return this.http.get(this.url).map((res: Response) => this.mapDates(res.json())).share();
  }
  past(): Observable<ITournament[]> {
    return this.http.get(`${this.url}/list/past`).map((res: Response) => this.mapDates(res.json())).share();
  }
  current(): Observable<ITournament[]> {
    return this.http.get(`${this.url}/list/current`).map((res: Response) => this.mapDates(res.json())).share();
  }
  upcoming(): Observable<ITournament[]> {
    return this.http.get(`${this.url}/list/future`).map((res: Response) => this.mapDates(res.json())).share();
  }
  getById(id: number): Observable<ITournament> {
    return this.http.get(`${this.url}/${id}`).map((res: Response) => this.mapDate(res.json())).share();
  }

  save(tournament: ITournament) {
    const call = (tournament.id)
      ? this.http.put(`${this.url}/${tournament.id}`, Helper.reduceLevels(tournament))
      : this.http.post(this.url, tournament);
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

  dateSpan(tournament: ITournament): string {
    const toDate = (date: moment.Moment) => moment(date).format('DD');
    if (tournament && tournament.startDate && tournament.endDate) {
      const start = moment(tournament.startDate);
      const end   = moment(tournament.endDate);
      const month = end.isSame(start, 'month') ? end.format('MMM') : start.format('MMM') + '/' + end.format('MMM');
      const year = moment(tournament.endDate).format('YYYY');
      if (end.diff(start, 'days') > 1) {
        return `${toDate(start)}.-${toDate(end)}. ${month} ${year}`;
      }
      return `${toDate(start)}. ${month} ${year}`;
    }
    return '';
  }

}
