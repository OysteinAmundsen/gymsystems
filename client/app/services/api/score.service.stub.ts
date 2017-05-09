import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/of';

import { ITournamentParticipantScore } from '../model/ITournamentParticipantScore';

@Injectable()
export class ScoreServiceStub {
  constructor(private http: Http) {  }

  getByParticipant(participantId: number) {
    return Observable.of(null);
  }

  saveFromParticipant(participantId: number, scores: ITournamentParticipantScore[]) {
    return Observable.of(null);
  }

  removeFromParticipant(participantId: number) {
    return Observable.of(null);
  }
}
