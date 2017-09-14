import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/of';

import { IClub, IGymnast, ITroop } from 'app/model';
import { ClubService } from './club.service';

@Injectable()
export class ClubServiceStub extends ClubService {

  constructor(http: Http) {
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
  getTeams(club: IClub): Observable<ITroop[]> {
    return Observable.of(null);
  }
  findTroopByName(club: IClub, name: string): Observable<ITroop[]> {
    return Observable.of(null);
  }
  saveTeam(team: ITroop) {
    return Observable.of(null);
  }
  deleteTeam(team: ITroop) {
    return Observable.of(null);
  }
}
