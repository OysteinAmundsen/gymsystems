import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import * as moment from 'moment';

import { ITournament } from 'app/model/ITournament';
import { Helper } from '../Helper';

@Injectable()
export class TournamentService {
  private url = '/api/tournaments';
  selected: ITournament;

  constructor(private http: HttpClient) {  }

  all(): Observable<ITournament[]> {
    return this.http.get<ITournament[]>(this.url).map((res: ITournament[]) => this.mapDates(res));
  }
  past(): Observable<ITournament[]> {
    return this.http.get<ITournament[]>(`${this.url}/list/past`).map((res: ITournament[]) => this.mapDates(res));
  }
  current(): Observable<ITournament[]> {
    return this.http.get<ITournament[]>(`${this.url}/list/current`).map((res: ITournament[]) => this.mapDates(res));
  }
  upcoming(): Observable<ITournament[]> {
    return this.http.get<ITournament[]>(`${this.url}/list/future`).map((res: ITournament[]) => this.mapDates(res));
  }
  getById(id: number): Observable<ITournament> {
    return this.http.get<ITournament>(`${this.url}/${id}`).map((res: ITournament) => this.mapDate(res));
  }

  save(tournament: ITournament): Observable<ITournament | any> {
    return (tournament.id)
      ? this.http.put<ITournament>(`${this.url}/${tournament.id}`, Helper.reduceLevels(tournament))
      : this.http.post<ITournament>(this.url, tournament);
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
