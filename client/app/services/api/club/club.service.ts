import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { IClub, IBelongsToClub, IGymnast, ITeam } from 'app/services/model';
import { Helper } from '../Helper';

@Injectable()
export class ClubService {
  url = '/api/clubs';
  constructor(private http: Http) { }

  all(): Observable<IClub[]> {
    return this.http.get(this.url).map((res: Response) => res.json()).share();
  }

  findByName(name: string): Observable<IClub[]> {
    return this.http.get(`${this.url}?name=${name}`).map((res: Response) => res.json()).share();
  }

  getById(id: number): Observable<IClub> {
    return this.http.get(`${this.url}/${id}`).map((res: Response) => res.json()).share();
  }

  saveClub(club: IClub) {
    return (club.id
      ? this.http.put(`${this.url}/${club.id}`, Helper.reduceLevels(club))
      : this.http.post(`${this.url}/`, club))
      .map((res: Response) => res.json());
  }

  deleteClub(club: IClub) {
    return this.http.delete(`${this.url}/${club.id}`).map((res: Response) => res.json());
  }

  getMembers(id: number): Observable<IGymnast[]> {
    return this.http.get(`${this.url}/${id}/members`).map((res: Response) => res.json());
  }

  saveMember(member: IGymnast) {
    return this.http.post(`${this.url}/${member.club.id}/members`, member).map((res: Response) => res.json());
  }

  deleteMember(member: IGymnast): any {
    return this.http.delete(`${this.url}/${member.club.id}/members/${member.id}`).map((res: Response) => res.json());
  }

  getTeams(id: number): Observable<ITeam[]> {
    return this.http.get(`${this.url}/${id}/teams`).map((res: Response) => res.json());
  }

  saveTeam(team: ITeam) {
    return this.http.post(`${this.url}/${team.club.id}/teams`, team).map((res: Response) => res.json());
  }

  deleteTeam(team: ITeam) {
    return this.http.delete(`${this.url}/${team.club.id}/teams/${team.id}`).map((res: Response) => res.json());
  }
}
