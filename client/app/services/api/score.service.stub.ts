import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/of';

import { ITeamInDisciplineScore } from '../model/ITeamInDisciplineScore';
import { ScoreService } from 'app/services/api';
import { ITeamInDiscipline } from 'app/services/model/ITeamInDiscipline';

@Injectable()
export class ScoreServiceStub {
  original: ScoreService;
  constructor(private http: Http) {
    this.original = new ScoreService(http);
  }

  getByParticipant(participantId: number) {
    return Observable.of(null);
  }

  saveFromParticipant(participantId: number, scores: ITeamInDisciplineScore[]) {
    return Observable.of(null);
  }

  removeFromParticipant(participantId: number) {
    return Observable.of(null);
  }

  calculateTeamTotal(participants: ITeamInDiscipline[]) {
    return this.original.calculateTeamTotal(participants);
  }

  calculateTotal(participant: ITeamInDiscipline) {
    return this.original.calculateTotal(participant);
  }
}
