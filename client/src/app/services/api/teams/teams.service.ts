import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ITeam, IDiscipline, DivisionType } from 'app/model';
import { Helper } from '../Helper';

@Injectable({ providedIn: 'root' })
export class TeamsService {
  url = '/api/teams';

  constructor(private http: HttpClient) { }

  /**
   *
   */
  all(): Observable<ITeam[]> {
    return this.http.get<ITeam[]>(this.url);
  }

  /**
   *
   */
  getByTournament(id: number): Observable<ITeam[]> {
    return this.http.get<ITeam[]>(`${this.url}/tournament/${id}`);
  }

  /**
   *
   */
  getMyTeamsByTournament(id: number): Observable<ITeam[]> {
    return this.http.get<ITeam[]>(`${this.url}/my/tournament/${id}`);
  }

  /**
   *
   */
  getById(id: number): Observable<ITeam> {
    return this.http.get<ITeam>(`${this.url}/${id}`);
  }

  /**
   *
   */
  save(team: ITeam) {
    return team.id
      ? this.http.put<ITeam>(`${this.url}/${team.id}`, Helper.reduceLevels(team, 2))
      : this.http.post<ITeam>(this.url, Helper.reduceLevels(team, 2));
  }

  /**
   *
   */
  delete(team: ITeam): Observable<ITeam> {
    return this.http.delete<ITeam>(`${this.url}/${team.id}`);
  }

  /**
   *
   */
  getDivisionName(team: ITeam) {
    const ageDiv = team.divisions.find(d => d.type === DivisionType.Age);
    const genderDiv = team.divisions.find(d => d.type === DivisionType.Gender);
    return `${(genderDiv ? genderDiv.name : '')} ${(ageDiv ? ageDiv.name : '')}`;
  }

  /**
   *
   */
  uploadMedia(file: File, team: ITeam, discipline: IDiscipline) {
    const formData = new FormData();
    formData.append('media', file, file.name);

    return this.http.post(`/api/media/upload/${team.id}/${discipline.id}`, formData);
  }

  /**
   *
   */
  removeMedia(team: ITeam, discipline: IDiscipline) {
    return this.http.delete(`/api/media/${team.id}/${discipline.id}`);
  }
}
