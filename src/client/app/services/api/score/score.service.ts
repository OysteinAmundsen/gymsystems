import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IScore, ITeamInDiscipline, Operation } from 'app/model';
import { Helper } from '../Helper';
import { Observable} from 'rxjs/Observable';

@Injectable()
export class ScoreService {
  url = '/api/score/participant';

  constructor(private http: HttpClient) {  }

  /**
   *
   * @param participantId
   */
  getByParticipant(participantId: number): Observable<IScore[]> {
    return this.http.get<IScore[]>(`${this.url}/${participantId}`);
  }

  /**
   *
   */
  saveFromParticipant(participantId: number, scores: IScore[]): Observable<IScore[]> {
    return this.http.post<IScore[]>(`${this.url}/${participantId}`, Helper.reduceLevels(scores));
  }

  /**
   *
   * @param participantId
   */
  removeFromParticipant(participantId: number) {
    return this.http.delete(`${this.url}/${participantId}`);
  }

  /**
   *
   * @param participantId
   */
  rollbackToParticipant(participantId: number) {
    return this.http.get(`${this.url}/${participantId}/rollback`);
  }

  /**
   *
   * @param participants
   */
  calculateTeamTotal(participants: ITeamInDiscipline[]) {
    if (!participants || !participants.length) { return 0; }
    return participants.reduce((prev, curr) => prev += this.calculateTotal(curr), 0);
  }

  /**
   *
   * @param participant
   * @param type
   */
  calculateScoreGroupTotal(participant: ITeamInDiscipline, type: string) {
    const add = (prev, num) => {prev += num; return prev; };
    const sub = (prev, num) => {prev -= num; return prev; };
    const isAdd = (score) => score.scoreGroup.operation === Operation.Addition;
    const scores = participant.scores.filter(s => s.scoreGroup.type === type);
    const total = this.fixScore(scores.length
      ? scores.reduce((prev: number, score: IScore) => isAdd(score) ? add(prev, score.value) : sub(prev, score.value), 0) / scores.length
      : 0
    );
    return total;
  }

  /**
   * Calculate final score
   *
   * @param participant
   */
  calculateTotal(participant: ITeamInDiscipline) {
    return participant.discipline.scoreGroups.reduce((prev, curr) => {
      const avg = this.calculateScoreGroupTotal(participant, curr.type);
      if (curr.operation === Operation.Addition) {
        prev += avg;
      } else {
        prev -= avg;
      }
      return prev;
    }, 0);
  }

  /**
   *
   * @param score
   */
  fixScore(score) {
    const fixedVal = (Math.ceil(score * 20) / 20).toFixed(2);
    return parseFloat(fixedVal);
  }
}
