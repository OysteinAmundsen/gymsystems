import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/of';

import { ScoreService } from './score.service';
import { IScore, ITeamInDiscipline } from 'app/services/model';

@Injectable()
export class ScoreServiceStub extends ScoreService {
  constructor(http: Http) {
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
