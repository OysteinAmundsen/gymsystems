import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as moment from 'moment';

import { ITournament } from 'app/model/ITournament';
import { Helper } from '../Helper';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class TournamentService {
  private url = '/api/tournaments';
  selected: ITournament;

  constructor(private http: HttpClient) {  }

  /**
   *
   */
  all(): Observable<ITournament[]> {
    return this.http.get<ITournament[]>(this.url).pipe(map((res: ITournament[]) => this.mapDates(res)));
  }

  /**
   *
   */
  past(): Observable<ITournament[]> {
    return this.http.get<ITournament[]>(`${this.url}/list/past`, {params: new HttpParams().set('now', new Date().toISOString())})
      .pipe(map((res: ITournament[]) => this.mapDates(res)));
  }

  /**
   *
   */
  current(): Observable<ITournament[]> {
    return this.http.get<ITournament[]>(`${this.url}/list/current`, {params: new HttpParams().set('now', new Date().toISOString())})
      .pipe(map((res: ITournament[]) => this.mapDates(res)));
  }

  /**
   *
   */
  upcoming(): Observable<ITournament[]> {
    return this.http.get<ITournament[]>(`${this.url}/list/future`, {params: new HttpParams().set('now', new Date().toISOString())})
      .pipe(map((res: ITournament[]) => this.mapDates(res)));
  }

  /**
   *
   * @param id
   */
  getById(id: number): Observable<ITournament> {
    return this.http.get<ITournament>(`${this.url}/${id}`).pipe(map((res: ITournament) => this.mapDate(res)));
  }

  /**
   *
   * @param tournament
   */
  save(tournament: ITournament): Observable<ITournament | any> {
    return (tournament.id)
      ? this.http.put<ITournament>(`${this.url}/${tournament.id}`, Helper.reduceLevels(tournament))
      : this.http.post<ITournament>(this.url, tournament);
  }

  /**
   *
   * @param tournament
   */
  delete(tournament: ITournament) {
    return this.http.delete(`${this.url}/${tournament.id}`);
  }

  /**
   *
   * @param tournament
   */
  mapDate(tournament: ITournament) {
    tournament.startDate = new Date(<string>tournament.startDate);
    tournament.endDate = new Date(<string>tournament.endDate);
    return tournament;
  }

  /**
   *
   * @param tournaments
   */
  private mapDates(tournaments: ITournament[]) {
    return tournaments.map(tournament => this.mapDate(tournament));
  }

  /**
   *
   * @param tournament
   */
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
