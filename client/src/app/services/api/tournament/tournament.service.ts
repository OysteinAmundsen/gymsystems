import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as moment from 'moment';

import { ITournament } from 'app/model/ITournament';
import { Helper } from '../Helper';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TournamentService {
  private url = '/api/tournaments';
  selected: ITournament;

  constructor(private http: HttpClient) { }

  /**
   *
   */
  all(): Observable<ITournament[]> {
    const query = `{getTournaments{id,name,startDate,endDate,description_no,description_en,times{day,time},venue{name,address,capacity}}}`;
    return this.http.get<ITournament[]>('/api/graph', { params: { query: query } })
      .pipe(map((res: any) => res.data.getTournaments));
  }

  /**
   *
   */
  getById(id: number): Observable<ITournament> {
    const query = `{
      tournament(id:${id}){
        id,
        name,
        description_no,
        description_en,
        startDate,
        endDate,
        times{day,time},
        venue{name,address,capacity}
      }}`.replace(/ +?|\r?\n|\r/g, '');
    return this.http.get<ITournament>(`/api/graph?query=${query}`)
      .pipe(map((res: any) => <ITournament>res.data.tournament));
  }

  /**
   *
   */
  save(tournament: ITournament): Observable<ITournament | any> {
    return (tournament.id)
      ? this.http.put<ITournament>(`${this.url}/${tournament.id}`, Helper.reduceLevels(tournament))
      : this.http.post<ITournament>(this.url, tournament);
  }

  /**
   *
   */
  delete(tournament: ITournament) {
    return this.http.delete(`${this.url}/${tournament.id}`);
  }

  /**
   *
   */
  dateSpan(tournament: ITournament): string {
    const toDate = (date: moment.Moment) => moment(date).format('DD');
    if (tournament && tournament.startDate && tournament.endDate) {
      const start = moment(tournament.startDate);
      const end = moment(tournament.endDate);
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
