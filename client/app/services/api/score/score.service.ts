import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IScore, ITeamInDiscipline } from 'app/model';
import { Helper } from '../Helper';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ScoreService {
  url = '/api/score/participant';

  constructor(private http: HttpClient) {  }

  getByParticipant(participantId: number): Observable<IScore[]> {
    return this.http.get<IScore[]>(`${this.url}/${participantId}`);
  }

  saveFromParticipant(participantId: number, scores: IScore[]): Observable<IScore[]> {
    return this.http.post<IScore[]>(`${this.url}/${participantId}`, Helper.reduceLevels(scores));
  }

  removeFromParticipant(participantId: number) {
    return this.http.delete(`${this.url}/${participantId}`);
  }

  rollbackToParticipant(participantId: number) {
    return this.http.get(`${this.url}/${participantId}/rollback`);
  }

  calculateTeamTotal(participants: ITeamInDiscipline[]) {
    if (!participants || !participants.length) { return 0; }
    return participants.reduce((prev, curr) => prev += this.calculateTotal(curr), 0) / participants.length;
  }

  calculateScoreGroupTotal(participant: ITeamInDiscipline, type: string) {
    const scores = participant.scores.filter(s => type.indexOf(s.scoreGroup.type) > -1);
    return this.fixScore(scores.length ? scores.reduce((p, c) => p += c.value, 0) / scores.length : 0);
  }

  // Calculate final score
  calculateTotal(participant: ITeamInDiscipline) {
    return participant.discipline.scoreGroups.reduce((prev, curr) => prev += this.calculateScoreGroupTotal(participant, curr.type), 0);
  }

  fixScore(score) {
    const fixedVal = (Math.ceil(score * 20) / 20).toFixed(2);
    return parseFloat(fixedVal);
  }
}
