import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/of';

import { IClub, IGymnast, ITroop } from 'app/model';
import { ClubService } from './club.service';

export const dummyClub: IClub = <IClub>{
  id  : 0,
  name: 'HAUGESUND TURNFORENING'
}

@Injectable()
export class ClubServiceStub extends ClubService {

  constructor(http: HttpClient) {
    super(http);
  }

  all(): Observable<IClub[]> {
    return Observable.of(null);
  }
  findByName(name: string): Observable<IClub[]> {
    return Observable.of(null);
  }

  getById(id: number): Observable<IClub> {
    return Observable.of(null);
  }
  saveClub(club: IClub) {
    return Observable.of(null);
  }
  deleteClub(club: IClub) {
    return Observable.of(null);
  }

  // MEMBER API
  getMembers(club: IClub): Observable<IGymnast[]> {
    return Observable.of(null);
  }
  getAvailableMembers(club: IClub): Observable<IGymnast[]> {
    return Observable.of(null);
  }

  importMembers(file: File, club: IClub) {
    return Observable.of(null);
  }

  saveMember(member: IGymnast) {
    return Observable.of(null);
  }
  deleteMember(member: IGymnast): any {
    return Observable.of(null);
  }

  // TROOPS API
  getTroops(club: IClub): Observable<ITroop[]> {
    return Observable.of(null);
  }
  findTroopByName(club: IClub, name: string): Observable<ITroop[]> {
    return Observable.of(null);
  }
  saveTroop(team: ITroop) {
    return Observable.of(null);
  }
  deleteTroop(team: ITroop) {
    return Observable.of(null);
  }
}
