import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of} from 'rxjs';

import { IDivision, DivisionType, ITournament } from 'app/model';
import { DivisionService } from './division.service';

export const dummyAgeDivision = <IDivision>{
  id: 0,
  name: 'Rekrutt',
  sortOrder: 0,
  type: DivisionType.Age,
  teams: [],
  min: 11,
  max: 14,
  scorable: true,
  tournament: <ITournament>{}
};

export const dummyGenderDivision = <IDivision>{
  id: 0,
  name: 'Herrer',
  sortOrder: 0,
  type: DivisionType.Gender,
  teams: [],
  tournament: <ITournament>{}
};

@Injectable()
export class DivisionServiceStub extends DivisionService {
  ageDivision: IDivision = dummyAgeDivision;
  genderDivision: IDivision = dummyGenderDivision;
  divisions: IDivision[] = [
    this.ageDivision, this.genderDivision
  ];
  constructor(http: HttpClient) {
    super(http);
  }

  all(): Observable<IDivision[]> {
    return of(this.divisions);
  }

  getByTournament(id: number): Observable<IDivision[]> {
    return of(this.divisions);
  }

  getById(id: number): Observable<IDivision> {
    return of(this.ageDivision);
  }

  save(division: IDivision) {
    return of(this.ageDivision);
  }

  saveAll(divisions: IDivision[]) {
    return of(this.divisions);
  }

  delete(division: IDivision) {
    return of(null);
  }
}
