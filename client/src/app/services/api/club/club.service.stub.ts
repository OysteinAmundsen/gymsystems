import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, pipe, of} from 'rxjs';

import { IClub, IGymnast, ITroop } from 'app/model';
import { ClubService } from './club.service';

export const dummyClub: IClub = <IClub>{
  id  : 0,
  name: 'HAUGESUND TURNFORENING'
};

@Injectable()
export class ClubServiceStub extends ClubService {

  constructor(http: HttpClient) {
    super(http);
  }

  all(): Observable<IClub[]> {
    return of(null);
  }
  findByName(name: string): Observable<IClub[]> {
    return of(null);
  }

  getById(id: number): Observable<IClub> {
    return of(null);
  }
  saveClub(club: IClub) {
    return of(null);
  }
  deleteClub(club: IClub) {
    return of(null);
  }

  // MEMBER API
  getMembers(club: IClub): Observable<IGymnast[]> {
    return of(null);
  }
  getAvailableMembers(club: IClub): Observable<IGymnast[]> {
    return of(null);
  }

  importMembers(file: File, club: IClub) {
    return of(null);
  }

  saveMember(member: IGymnast) {
    return of(null);
  }
  deleteMember(member: IGymnast): any {
    return of(null);
  }

  // TROOPS API
  getTroops(club: IClub): Observable<ITroop[]> {
    return of(null);
  }
  findTroopByName(club: IClub, name: string): Observable<ITroop[]> {
    return of(null);
  }
  saveTroop(team: ITroop) {
    return of(null);
  }
  deleteTroop(team: ITroop) {
    return of(null);
  }
}
