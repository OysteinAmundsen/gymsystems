import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { ITeam, IClub, IDiscipline, IDivision } from 'app/model';

import { TeamsService } from './teams.service';
import { dummyTournament } from '../tournament/tournament.service.stub';
import { dummyAgeDivision, dummyGenderDivision } from '../division/division.service.stub';

export const dummyTeam = <ITeam>{
  id: 0,
  name: 'test',
  divisions: [dummyAgeDivision, dummyGenderDivision],
  disciplines: [],
  tournament: dummyTournament,
  club: <IClub>{}
};

@Injectable()
export class TeamsServiceStub extends TeamsService {
  team: ITeam = dummyTeam;
  teams: ITeam[] = [
    this.team
  ];
  constructor(http: HttpClient) {
    super(http);
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

  uploadMedia(file: File, team: ITeam, discipline: IDiscipline) {
    return Observable.of(null);
  }

  removeMedia(team: ITeam, discipline: IDiscipline) {
    return Observable.of(null);
  }
}
