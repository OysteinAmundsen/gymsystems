import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { ITeam, Team } from './model/iTeam';


export interface ITournament {
  id: number,
  name: string;
  startDate: Date;
  location: string;
  teams: ITeam[];
}

export class Tournament implements ITournament {
  static mapTo(json: ITournament | ITournament[]): Tournament | Tournament[] {
    if (Array.isArray(json)) {
      return json.map((item: ITournament) => new Tournament(item.id, item.name, new Date(item.startDate), item.location, <Team[]>Team.mapTo(item.teams)));
    } else {
      return new Tournament(json.id, json.name, new Date(json.startDate), json.location, <Team[]>Team.mapTo(json.teams));
    }
  }
  constructor(public id: number, public name: string, public startDate: Date, public location: string, public teams: ITeam[]) { }
}

@Injectable()
export class TournamentService {
  _selectedTournament: ITournament;
  get selected(): ITournament { return this._selectedTournament; }
  set selected(tournament: ITournament) { this._selectedTournament = tournament; }

  constructor(private http: Http) { }

  all(): Observable<ITournament[]> {
    // return this.http.get('/api/tournaments').map((res: Response) => res.json()).catch(this.handleError);
    return this.http.get('/app/api/mock/tournaments.json').map((res: Response) => res.json()).catch(this.handleError);
  }
  past(): Observable<ITournament[]> {
    // return this.http.get('/api/tournaments/past').map((res: Response) => res.json()).catch(this.handleError);
    return this.http.get('/app/api/mock/tournaments.json').map((res: Response) => res.json()).catch(this.handleError);
  }
  upcoming(): Observable<ITournament[]> {
    // return this.http.get('/api/tournaments/future').map((res: Response) => res.json()).catch(this.handleError);
    return this.http.get('/app/api/mock/tournaments.json').map((res: Response) => res.json()).catch(this.handleError);
  }

  filterByName(name: string): Observable<ITournament[]> {
    // return this.http.get('/api/tournaments?$filter=' + name).map((res: Response) => res.json()).catch(this.handleError);
    return this.http.get('/api/tournaments?$filter=' + name).map((res: Response) => res.json()).catch(this.handleError);
  }

  getById(id: number): Observable<Tournament> {
    // return this.http.get('/api/tournaments/' + id).map((res: Response) => res.json()).catch(this.handleError);
    return this.http.get('/app/api/mock/tournaments.json')
      .map((res: Response) => Tournament.mapTo(res.json().filter((tournament) => tournament.id === id)[0]))
      .catch(this.handleError);
  }
  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
