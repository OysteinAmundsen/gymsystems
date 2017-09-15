import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { IClub, IBelongsToClub, IGymnast, ITroop } from 'app/model';
import { Helper } from '../Helper';

@Injectable()
export class ClubService {
  url = '/api/clubs';
  constructor(private http: HttpClient) { }

  all(): Observable<IClub[]> {
    return this.http.get<IClub[]>(this.url);
  }

  findByName(name: string): Observable<IClub[]> {
    return this.http.get<IClub[]>(`${this.url}?name=${name}`);
  }

  getById(id: number): Observable<IClub> {
    return this.http.get<IClub>(`${this.url}/${id}`);
  }

  saveClub(club: IClub): Observable<IClub> {
    return (club.id
      ? this.http.put<IClub>(`${this.url}/${club.id}`, Helper.reduceLevels(club))
      : this.http.post<IClub>(`${this.url}/`, club));
  }

  deleteClub(club: IClub) {
    return this.http.delete(`${this.url}/${club.id}`);
  }

  // MEMBER API
  getMembers(club: IClub): Observable<IGymnast[]> {
    return this.http.get<IGymnast[]>(`${this.url}/${club.id}/members`);
  }

  getAvailableMembers(club: IClub): Observable<IGymnast[]> {
    return this.http.get<IGymnast[]>(`${this.url}/${club.id}/available-members`);
  }

  importMembers(file: File, club: IClub) {
    const formData = new FormData();
    formData.append('members', file, file.name);

    return this.http.post(`${this.url}/${club.id}/import-members`, formData)
      .catch(error => Observable.throw(error));
  }

  saveMember(member: IGymnast): Observable<IGymnast | any> {
    return this.http.post<IGymnast | any>(`${this.url}/${member.club.id}/members`, member);
  }

  deleteMember(member: IGymnast): any {
    return this.http.delete(`${this.url}/${member.club.id}/members/${member.id}`);
  }

  // TROOPS API
  getTeams(club: IClub): Observable<ITroop[]> {
    return this.http.get<ITroop[]>(`${this.url}/${club.id}/troop`);
  }

  findTroopByName(club: IClub, name: string): Observable<ITroop[]> {
    return this.http.get<ITroop[]>(`${this.url}/${club.id}/troop?name=${name}`);
  }

  saveTeam(team: ITroop) {
    return this.http.post<ITroop>(`${this.url}/${team.club.id}/troop`, team);
  }

  deleteTeam(team: ITroop) {
    return this.http.delete(`${this.url}/${team.club.id}/troop/${team.id}`);
  }
}
