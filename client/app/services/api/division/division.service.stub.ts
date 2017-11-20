import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/of';

import { IDivision, DivisionType, ITournament } from 'app/model';
import { DivisionService } from './division.service';

@Injectable()
export class DivisionServiceStub extends DivisionService {
  ageDivision: IDivision = <IDivision>{
    id: 0,
    name: '',
    sortOrder: 0,
    type: DivisionType.Age,
    teams: [],
    tournament: <ITournament>{}
  };
  genderDivision: IDivision = <IDivision>{
    id: 0,
    name: '',
    sortOrder: 0,
    type: DivisionType.Gender,
    teams: [],
    tournament: <ITournament>{}
  };
  divisions: IDivision[] = [
    this.ageDivision, this.genderDivision
  ];
  constructor(http: HttpClient) {
    super(http);
  }

  all(): Observable<IDivision[]> {
    return Observable.of(this.divisions);
  }

  getByTournament(id: number): Observable<IDivision[]> {
    return Observable.of(this.divisions);
  }

  getById(id: number): Observable<IDivision> {
    return Observable.of(this.ageDivision);
  }

  save(division: IDivision) {
    return Observable.of(this.ageDivision);
  }

  saveAll(divisions: IDivision[]) {
    return Observable.of(this.divisions);
  }

  delete(division: IDivision) {
    return Observable.of(null);
  }
}
