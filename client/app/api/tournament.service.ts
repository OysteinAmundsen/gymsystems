import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { ITournament } from './model/ITournament';
import { ApiService } from './ApiService';
import * as moment from 'moment';
import Moment = moment.Moment;


@Injectable()
export class TournamentService extends ApiService {
  url: string = '/api/tournaments';
  _selectedTournament: ITournament;
  get selected(): ITournament { return this._selectedTournament; }
  set selected(tournament: ITournament) { this._selectedTournament = tournament; }

  constructor(private http: Http) {
    super();
  }

  all(): Observable<ITournament[]> {
    return this.http.get(this.url).map((res: Response) => this.mapDates(res.json())).catch(this.handleError);
  }
  past(): Observable<ITournament[]> {
    return this.http.get(this.url + '/past').map((res: Response) => this.mapDates(res.json())).catch(this.handleError);
  }
  current(): Observable<ITournament[]> {
    return this.http.get(this.url + '/current').map((res: Response) => this.mapDates(res.json())).catch(this.handleError);
  }
  upcoming(): Observable<ITournament[]> {
    return this.http.get(this.url + '/future').map((res: Response) => this.mapDates(res.json())).catch(this.handleError);
  }
  getById(id: number): Observable<ITournament> {
    return this.http.get(this.url + '/' + id).map((res: Response) => this.mapDates([res.json()])).catch(this.handleError);
  }

  save(tournament: ITournament) {
    if (tournament.startDate.hasOwnProperty('momentObj')) {
      tournament.startDate = tournament.startDate.momentObj.utc().toISOString();
    }
    if (tournament.endDate.hasOwnProperty('momentObj')) {
      tournament.endDate = tournament.endDate.momentObj.utc().toISOString();
    }
    let call = (tournament.id) ? this.http.put(this.url, tournament) : this.http.post(this.url, tournament);
    return call.map((res: Response) => res.json()).catch(this.handleError);
  }

  private mapDates(tournaments: ITournament[]) {
    return tournaments.map(tournament => {
      tournament.startDate = new Date(tournament.startDate);
      tournament.endDate = new Date(tournament.endDate);
      return tournament;
    });
  }
}
