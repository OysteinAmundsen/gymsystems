import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';

import { ApiService } from './ApiService';
import { ITeam } from './model/ITeam';
import { DivisionType } from './model/DivisionType';

@Injectable()
export class TeamsService extends ApiService {
  url: string = '/api/teams';

  constructor(private http: Http) {
    super();
  }

  all(): Observable<ITeam[]> {
    return this.http.get(this.url).map((res: Response) => res.json()).share().catch(this.handleError);
  }

  getByTournament(id: number): Observable<ITeam[]> {
    return this.http.get(`${this.url}/tournament/${id}`).map((res: Response) => res.json()).share().catch(this.handleError);
  }

  getById(id: number): Observable<ITeam> {
    return this.http.get(`${this.url}/${id}`).map((res: Response) => res.json()).share().catch(this.handleError);
  }

  save(team: ITeam) {
    const call = (team.id) ? this.http.put(`${this.url}/${team.id}`, team) : this.http.post(this.url, team);
    return call.map((res: Response) => res.json()).catch(this.handleError);
  }

  delete(team: ITeam) {
    return this.http.delete(`${this.url}/${team.id}`);
  }

  division(team: ITeam) {
    const ageDiv = team.divisions.find(d => d.type === DivisionType.Age);
    const genderDiv = team.divisions.find(d => d.type === DivisionType.Gender);
    return (genderDiv ? genderDiv.name : '') + ' ' + (ageDiv ? ageDiv.name : '');
  }
}
