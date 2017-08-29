import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';

import { IScore, ITeamInDiscipline } from 'app/services/model';
import { Helper } from '../Helper';

@Injectable()
export class ScoreService {
  url = '/api/score/participant';

  constructor(private http: Http) {  }

  getByParticipant(participantId: number) {
    return this.http.get(`${this.url}/${participantId}`).map((res: Response) => res.json()).share();
  }

  saveFromParticipant(participantId: number, scores: IScore[]) {
    return this.http.post(`${this.url}/${participantId}`, Helper.reduceLevels(scores)).map((res: Response) => res.json()).share();
  }

  removeFromParticipant(participantId: number) {
    return this.http.delete(`${this.url}/${participantId}`).map((res: Response) => res.json()).share();
  }

  rollbackToParticipant(participantId: number) {
    return this.http.get(`${this.url}/${participantId}/rollback`).map((res: Response) => res.json()).share();
  }

  calculateTeamTotal(participants: ITeamInDiscipline[]) {
    if (!participants || !participants.length) { return 0; }
    return participants.reduce((prev, curr) => prev += this.calculateTotal(curr), 0) / participants.length;
  }

  calculateTotal(participant: ITeamInDiscipline) {
    // Calculate final score
    return participant.discipline.scoreGroups.reduce((prev, curr) => {
      const scores = participant.scores.filter(s => s.scoreGroup.id === curr.id);
      return prev += scores.length ? scores.reduce((p, c) => p += c.value, 0) / scores.length : 0;
    }, 0);
  }
}
