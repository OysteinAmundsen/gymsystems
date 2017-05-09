import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/of';

import { IDiscipline } from '../model/IDiscipline';
import { ITournament } from "app/services/model/ITournament";

@Injectable()
export class DisciplineServiceStub {
  discipline: IDiscipline = <IDiscipline>{
    id: 0,
    name: '',
    sortOrder: 0,
    tournament: <ITournament>{},
    scoreGroups: []
  }
  disciplines: IDiscipline[] = [
    this.discipline
  ]
  constructor(private http: Http) {  }

  all(): Observable<IDiscipline[]> {
    return Observable.of(this.disciplines);
  }

  getByTournament(id: number): Observable<IDiscipline[]> {
    return Observable.of(this.disciplines);
  }

  getById(id: number): Observable<IDiscipline> {
    return Observable.of(this.discipline);
  }

  save(discipline: IDiscipline) {
    return Observable.of(this.discipline);
  }

  saveAll(disciplines: IDiscipline[]) {
    return Observable.of(this.disciplines);
  }

  delete(discipline: IDiscipline) {
    return Observable.of(null);
  }
}
