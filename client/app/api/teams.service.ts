import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { ApiService } from './ApiService';
import { ITeam } from './model/ITeam';

@Injectable()
export class TeamsService extends ApiService {
  url: string = '/api/teams';

  _selectedTeam: ITeam;
  get selected(): ITeam { return this._selectedTeam; }
  set selected(team: ITeam) { this._selectedTeam = team; }

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
    return this.http.get(`${this.url}/${id}`).map((res: Response) => res.json()).catch(this.handleError);
  }

  save(team: ITeam) {
    const call = (team.id) ? this.http.put(`${this.url}/${team.id}`, team) : this.http.post(this.url, team);
    return call.map((res: Response) => res.json()).catch(this.handleError);
  }

  delete(team: ITeam) {
    return this.http.delete(`${this.url}/${team.id}`);
  }
}
