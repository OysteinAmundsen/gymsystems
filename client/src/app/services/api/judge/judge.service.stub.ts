import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of} from 'rxjs';

import { IJudge } from 'app/model';
import { JudgeService } from './judge.service';
import { IJudgeInScoreGroup } from '../../../model/IJudgeInScoreGroup';

export const defaultJudge = <IJudge>
  { id: 1, name: 'System', email: null, phone: null, allergies: null, scoreGroups: null };

@Injectable()
export class JudgeServiceStub extends JudgeService {
  constructor(http: HttpClient) {
    super(http);
  }

  all(): Observable<IJudge[]> {
    return of([defaultJudge]);
  }

  save(scoreGroup: IJudge) {
    return of(null);
  }
}
