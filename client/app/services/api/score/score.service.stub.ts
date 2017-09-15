import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { ScoreService } from './score.service';
import { IScore, ITeamInDiscipline } from 'app/model';

@Injectable()
export class ScoreServiceStub extends ScoreService {
  constructor(http: HttpClient) {
    super(http);
  }

  getByParticipant(participantId: number) {
    return Observable.of(null);
  }

  saveFromParticipant(participantId: number, scores: IScore[]) {
    return Observable.of(null);
  }

  removeFromParticipant(participantId: number) {
    return Observable.of(null);
  }

  rollbackToParticipant(participantId: number) {
    return Observable.of(null);
  }
}
