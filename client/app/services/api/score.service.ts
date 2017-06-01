import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';

import { ITournamentParticipantScore } from '../model/ITournamentParticipantScore';
import { ITournamentParticipant } from '../model/ITournamentParticipant';
import { Classes } from '../model/Classes';

@Injectable()
export class ScoreService {
  url = '/api/score/participant';

  constructor(private http: Http) {  }

  getByParticipant(participantId: number) {
    return this.http.get(`${this.url}/${participantId}`).map((res: Response) => res.json()).share();
  }

  saveFromParticipant(participantId: number, scores: ITournamentParticipantScore[]) {
    return this.http.post(`${this.url}/${participantId}`, scores).map((res: Response) => res.json()).share();
  }

  removeFromParticipant(participantId: number) {
    return this.http.delete(`${this.url}/${participantId}`).map((res: Response) => res.json()).share();
  }

  calculateTeamTotal(participants: ITournamentParticipant[]) {
    if (!participants || !participants.length) { return 0; }
    return participants.reduce((prev, curr) => prev += this.calculateTotal(curr), 0) / participants.length;
  }

  calculateTotal(participant: ITournamentParticipant) {
    // Calculate final score
    return participant.discipline.scoreGroups.reduce((prev, curr) => {
      const scores = participant.scores.filter(s => s.scoreGroup.id === curr.id);
      return prev += scores.length ? scores.reduce((p, c) => p += c.value, 0) / scores.length : 0;
    }, 0);
  }
}
