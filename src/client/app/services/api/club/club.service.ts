import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IClub, IBelongsToClub, IGymnast, ITroop } from 'app/model';
import { Helper } from '../Helper';

@Injectable()
export class ClubService {
  url = '/api/clubs';
  constructor(private http: HttpClient) { }

  /**
   *
   */
  all(): Observable<IClub[]> {
    return this.http.get<IClub[]>(this.url);
  }

  /**
   *
   */
  findByName(name: string): Observable<IClub[]> {
    return this.http.get<IClub[]>(`${this.url}?name=${name}`);
  }

  /**
   *
   * @param id
   */
  getById(id: number): Observable<IClub> {
    return this.http.get<IClub>(`${this.url}/${id}`);
  }

  /**
   *
   * @param club {IClub}
   */
  saveClub(club: IClub): Observable<IClub> {
    return (club.id
      ? this.http.put<IClub>(`${this.url}/${club.id}`, Helper.reduceLevels(club))
      : this.http.post<IClub>(`${this.url}/`, club));
  }

  /**
   *
   * @param club {IClub}
   */
  deleteClub(club: IClub) {
    return this.http.delete(`${this.url}/${club.id}`);
  }

  // MEMBER API
  /**
   *
   * @param club
   * @param id
   */
  getMember(club: IClub, id: number): Observable<IGymnast> {
    return this.http.get<IGymnast>(`${this.url}/${club.id}/members/${id}`);
  }

  /**
   *
   * @param club
   */
  getMembers(club: IClub): Observable<IGymnast[]> {
    return this.http.get<IGymnast[]>(`${this.url}/${club.id}/members`);
  }

  /**
   *
   * @param club
   */
  getAvailableMembers(club: IClub): Observable<IGymnast[]> {
    return this.http.get<IGymnast[]>(`${this.url}/${club.id}/available-members`);
  }

  /**
   *
   * @param file
   * @param club
   */
  importMembers(file: File, club: IClub) {
    const formData = new FormData();
    formData.append('members', file, file.name);

    return this.http.post(`${this.url}/${club.id}/import-members`, formData)
      .pipe(
        catchError(error => throwError(error))
      );
  }

  /**
   *
   * @param member
   */
  saveMember(member: IGymnast): Observable<IGymnast | any> {
    return this.http.post<IGymnast | any>(`${this.url}/${member.club.id}/members`, member);
  }

  /**
   *
   * @param member
   */
  deleteMember(member: IGymnast): any {
    return this.http.delete(`${this.url}/${member.club.id}/members/${member.id}`);
  }

  /**
   *
   * @param club
   * @param members
   */
  deleteAllMembers(club: IClub, members?: IGymnast[]): any {
    let params = new HttpParams();
    if (members) {
      members.forEach(t => params = params.append('memberId', `${t.id}`));
    }
    return this.http.delete(`${this.url}/${club.id}/members`);
  }

  // TROOPS API
  /**
   *
   * @param club
   */
  getTroops(club: IClub): Observable<ITroop[]> {
    return this.http.get<ITroop[]>(`${this.url}/${club.id}/troop`);
  }

  /**
   *
   * @param club
   */
  getTroopsCount(club: IClub): Observable<number> {
    return this.http.get<number>(`${this.url}/${club.id}/troop/count`);
  }

  /**
   *
   * @param club
   * @param id
   */
  getTroop(club: IClub, id: number): Observable<ITroop> {
    return this.http.get<ITroop>(`${this.url}/${club.id}/troop/${id}`);
  }

  /**
   *
   * @param club
   * @param name
   */
  findTroopByName(club: IClub, name: string): Observable<ITroop[]> {
    return this.http.get<ITroop[]>(`${this.url}/${club.id}/troop?name=${name}`);
  }

  /**
   *
   * @param team
   */
  saveTroop(team: ITroop) {
    return this.http.post<ITroop>(`${this.url}/${team.club.id}/troop`, team);
  }

  /**
   *
   * @param club
   * @param teams
   */
  saveAllTroops(club: IClub, teams: ITroop[]): Observable<ITroop[]> {
    return this.http.post<ITroop[]>(`${this.url}/${club.id}/troop`, teams);
  }

  /**
   *
   * @param team
   */
  deleteTroop(team: ITroop) {
    return this.http.delete(`${this.url}/${team.club.id}/troop/${team.id}`);
  }

  /**
   *
   * @param club
   * @param troops
   */
  deleteAllTroops(club: IClub, troops?: ITroop[]) {
    let params = new HttpParams();
    if (troops) {
      troops.forEach(t => params = params.append('troopId', `${t.id}`));
    }
    return this.http.delete(`${this.url}/${club.id}/troop`, {params: params});
  }
}
