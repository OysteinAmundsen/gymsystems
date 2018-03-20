import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { IScoreGroup, IJudgeInScoreGroup } from 'app/model';
import { ScoreGroupService } from './scoregroup.service';
import { defaultJudge } from '../judge/judge.service.stub';

export const compositionScoreGroup = <IScoreGroup>{
  id: 1, name: 'Composition', type: 'C',  operation: 1, judges: <IJudgeInScoreGroup[]>[{judge: defaultJudge, scoreGroup: null, sortNumber: 0}], max: 5,  min: 0, discipline: null
};
export const defaultScoreGroups = <IScoreGroup[]>[
  compositionScoreGroup,
  { id: 2, name: 'Execution',   type: 'E',  operation: 1, judges:  <IJudgeInScoreGroup[]>[{judge: defaultJudge, scoreGroup: null, sortNumber: 0}], max: 10, min: 0, discipline: null },
  { id: 3, name: 'Difficulty',  type: 'D',  operation: 1, judges:  <IJudgeInScoreGroup[]>[{judge: defaultJudge, scoreGroup: null, sortNumber: 0}], max: 5,  min: 0, discipline: null },
  { id: 4, name: 'Adjustments', type: 'HJ', operation: 2, judges:  <IJudgeInScoreGroup[]>[{judge: defaultJudge, scoreGroup: null, sortNumber: 0}], max: 5,  min: 0, discipline: null }
];

@Injectable()
export class ScoreGroupServiceStub extends ScoreGroupService {
  constructor(http: HttpClient) {
    super(http);
  }

  all(): Observable<IScoreGroup[]> {
    return Observable.of(defaultScoreGroups);
  }

  getByDiscipline(id: number): Observable<IScoreGroup[]> {
    return Observable.of(defaultScoreGroups);
  }

  getById(id: number): Observable<IScoreGroup> {
    return Observable.of(defaultScoreGroups[0]);
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
