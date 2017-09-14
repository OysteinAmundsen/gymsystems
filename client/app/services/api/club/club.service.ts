import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { IClub, IBelongsToClub, IGymnast, ITroop } from 'app/model';
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

  // MEMBER API
  getMembers(club: IClub): Observable<IGymnast[]> {
    return this.http.get(`${this.url}/${club.id}/members`).map((res: Response) => res.json());
  }

  getAvailableMembers(club: IClub): Observable<IGymnast[]> {
    return this.http.get(`${this.url}/${club.id}/available-members`).map((res: Response) => res.json());
  }

  importMembers(file: File, club: IClub) {
    const formData = new FormData();
    formData.append('members', file, file.name);

    return this.http.post(`${this.url}/${club.id}/import-members`, formData)
      .map(res => res.json())
      .catch(error => Observable.throw(error));
  }

  saveMember(member: IGymnast) {
    return this.http.post(`${this.url}/${member.club.id}/members`, member).map((res: Response) => res.json());
  }

  deleteMember(member: IGymnast): any {
    return this.http.delete(`${this.url}/${member.club.id}/members/${member.id}`).map((res: Response) => res.json());
  }

  // TROOPS API
  getTeams(club: IClub): Observable<ITroop[]> {
    return this.http.get(`${this.url}/${club.id}/troop`).map((res: Response) => res.json());
  }

  findTroopByName(club: IClub, name: string): Observable<ITroop[]> {
    return this.http.get(`${this.url}/${club.id}/troop?name=${name}`).map((res: Response) => res.json());
  }

  saveTeam(team: ITroop) {
    return this.http.post(`${this.url}/${team.club.id}/troop`, team).map((res: Response) => res.json());
  }

  deleteTeam(team: ITroop) {
    return this.http.delete(`${this.url}/${team.club.id}/troop/${team.id}`).map((res: Response) => res.json());
  }
}
