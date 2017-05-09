import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/of';

import { IScoreGroup } from '../model/IScoreGroup';

@Injectable()
export class ScoreGroupServiceStub {
  constructor(private http: Http) {  }

  all(): Observable<IScoreGroup[]> {
    return Observable.of(null);
  }

  getByDiscipline(id: number): Observable<IScoreGroup[]> {
    return Observable.of(null);
  }

  getById(id: number): Observable<IScoreGroup> {
    return Observable.of(null);
  }

  save(scoreGroup: IScoreGroup) {
    return Observable.of(null);
  }

  saveAll(scoreGroups: IScoreGroup[]) {
    return Observable.of(null);
  }

  delete(scoreGroup: IScoreGroup) {
    return Observable.of(null);
  }
}
