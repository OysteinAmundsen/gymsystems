import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/throw';

import * as moment from 'moment';
import Moment = moment.Moment;

import { ITournament } from './model/ITournament';
import { ApiService } from './ApiService';

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
    return this.http.get(this.url).map((res: Response) => this.mapDates(res.json())).share().catch(this.handleError);
  }
  past(): Observable<ITournament[]> {
    return this.http.get(`${this.url}/past`).map((res: Response) => this.mapDates(res.json())).catch(this.handleError);
  }
  current(): Observable<ITournament[]> {
    return this.http.get(`${this.url}/current`).map((res: Response) => this.mapDates(res.json())).catch(this.handleError);
  }
  upcoming(): Observable<ITournament[]> {
    return this.http.get(`${this.url}/future`).map((res: Response) => this.mapDates(res.json())).catch(this.handleError);
  }
  getById(id: number): Observable<ITournament> {
    return this.http.get(`${this.url}/${id}`).map((res: Response) => this.mapDate(res.json())).catch(this.handleError);
  }

  save(tournament: ITournament) {
    let call = (tournament.id) ? this.http.put(`${this.url}/${tournament.id}`, tournament) : this.http.post(this.url, tournament);
    return call.map((res: Response) => res.json()).catch(this.handleError);
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
