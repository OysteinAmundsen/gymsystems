import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/of';

import { ITeam } from '../model/ITeam';
import { DivisionType } from '../model/DivisionType';
import { ITournament } from 'app/services/model/ITournament';
import { IClub } from 'app/services/model/IClub';

@Injectable()
export class TeamsServiceStub {
  team: ITeam = <ITeam>{
    id: 0,
    name: '',
    divisions: [],
    disciplines: [],
    tournament: <ITournament>{},
    club: <IClub>{}
  };
  teams: ITeam[] = [
    this.team
  ];
  constructor(private http: Http) {  }

  all(): Observable<ITeam[]> {
    return Observable.of(this.teams);
  }

  getByTournament(id: number): Observable<ITeam[]> {
    return Observable.of(this.teams);
  }

  getMyTeamsByTournament(id: number): Observable<ITeam[]> {
    return Observable.of(this.teams);
  }

  getById(id: number): Observable<ITeam> {
    return Observable.of(this.team);
  }

  save(team: ITeam) {
    return Observable.of(this.team);
  }

  delete(team: ITeam) {
    return Observable.of(null);
  }

  division(team: ITeam) {
    return Observable.of(null);
  }
}
