import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of} from 'rxjs';

import { IScoreGroup, IJudgeInScoreGroup } from 'app/model';
import { ScoreGroupService } from './scoregroup.service';
import { defaultJudge } from '../judge/judge.service.stub';

export const compositionScoreGroup = <IScoreGroup>{
  // tslint:disable-next-line:max-line-length
  id: 1, name: 'Composition', type: 'C',  operation: 1, judges: <IJudgeInScoreGroup[]>[{judge: defaultJudge, scoreGroup: null, sortNumber: 0}], max: 5,  min: 0, discipline: null
};
export const defaultScoreGroups = <IScoreGroup[]>[
  compositionScoreGroup,
  // tslint:disable-next-line:max-line-length
  { id: 2, name: 'Execution',   type: 'E',  operation: 1, judges:  <IJudgeInScoreGroup[]>[{judge: defaultJudge, scoreGroup: null, sortNumber: 0}], max: 10, min: 0, discipline: null },
  // tslint:disable-next-line:max-line-length
  { id: 3, name: 'Difficulty',  type: 'D',  operation: 1, judges:  <IJudgeInScoreGroup[]>[{judge: defaultJudge, scoreGroup: null, sortNumber: 0}], max: 5,  min: 0, discipline: null },
  // tslint:disable-next-line:max-line-length
  { id: 4, name: 'Adjustments', type: 'HJ', operation: 2, judges:  <IJudgeInScoreGroup[]>[{judge: defaultJudge, scoreGroup: null, sortNumber: 0}], max: 5,  min: 0, discipline: null }
];

@Injectable()
export class ScoreGroupServiceStub extends ScoreGroupService {
  constructor(http: HttpClient) {
    super(http);
  }

  all(): Observable<IScoreGroup[]> {
    return of(defaultScoreGroups);
  }

  getByDiscipline(id: number): Observable<IScoreGroup[]> {
    return of(defaultScoreGroups);
  }

  getById(id: number): Observable<IScoreGroup> {
    return of(defaultScoreGroups[0]);
  }

  save(scoreGroup: IScoreGroup) {
    return of(null);
  }

  saveAll(scoreGroups: IScoreGroup[]) {
    return of(null);
  }

  delete(scoreGroup: IScoreGroup) {
    return of(null);
  }
}
