import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/of';

import { IScoreGroup } from '../model/IScoreGroup';

export const scoreGroups = <IScoreGroup[]>[
  { id: 1, name: 'Composition', type: 'C',  operation: 1, judges: 2, max: 5,  min: 0, discipline: null },
  { id: 2, name: 'Execution',   type: 'E',  operation: 1, judges: 4, max: 10, min: 0, discipline: null },
  { id: 3, name: 'Difficulty',  type: 'D',  operation: 1, judges: 2, max: 5,  min: 0, discipline: null },
  { id: 4, name: 'Adjustments', type: 'HJ', operation: 2, judges: 1, max: 5,  min: 0, discipline: null }
];

@Injectable()
export class ScoreGroupServiceStub {
  constructor(private http: Http) {  }

  all(): Observable<IScoreGroup[]> {
    return Observable.of(scoreGroups);
  }

  getByDiscipline(id: number): Observable<IScoreGroup[]> {
    return Observable.of(scoreGroups);
  }

  getById(id: number): Observable<IScoreGroup> {
    return Observable.of(scoreGroups[0]);
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
