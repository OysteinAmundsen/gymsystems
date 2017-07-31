import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/of';

import { ITeam, IClub, IDiscipline } from 'app/services/model';

import { TeamsService } from './teams.service';
import { dummyTournament } from '../tournament/tournament.service.stub';

export const dummyTeam = <ITeam>{
  id: 0,
  name: '',
  divisions: [],
  disciplines: [],
  tournament: dummyTournament,
  club: <IClub>{}
};

@Injectable()
export class TeamsServiceStub {
  original: TeamsService;
  team: ITeam = dummyTeam;
  teams: ITeam[] = [
    this.team
  ];
  constructor(private http: Http) {
    this.original = new TeamsService(http);
  }

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

  getDivisionName(team: ITeam) {
    return this.original.getDivisionName(team);
  }

  uploadMedia(file: File, team: ITeam, discipline: IDiscipline) {
  }

  removeMedia(team: ITeam, discipline: IDiscipline) {
  }
}
