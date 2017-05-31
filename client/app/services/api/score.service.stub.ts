import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/of';

import { ITournamentParticipantScore } from '../model/ITournamentParticipantScore';
import { ScoreService } from "app/services/api";
import { ITournamentParticipant } from "app/services/model/ITournamentParticipant";

@Injectable()
export class ScoreServiceStub {
  original: ScoreService;
  constructor(private http: Http) {
    this.original = new ScoreService(http);
  }

  getByParticipant(participantId: number) {
    return Observable.of(null);
  }

  saveFromParticipant(participantId: number, scores: ITournamentParticipantScore[]) {
    return Observable.of(null);
  }

  removeFromParticipant(participantId: number) {
    return Observable.of(null);
  }

  calculateTeamTotal(participants: ITournamentParticipant[]) {
    return this.original.calculateTeamTotal(participants);
  }

  calculateTotal(participant: ITournamentParticipant) {
    return this.original.calculateTotal(participant);
  }
}
