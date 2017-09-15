import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { IDiscipline, ITournament } from 'app/model';
import { DisciplineService } from './discipline.service';

@Injectable()
export class DisciplineServiceStub extends DisciplineService{
  discipline: IDiscipline = <IDiscipline>{
    id: 0,
    name: '',
    sortOrder: 0,
    tournament: <ITournament>{},
    scoreGroups: []
  };
  disciplines: IDiscipline[] = [
    this.discipline
  ];
  constructor(http: HttpClient) {
    super(http);
  }

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
