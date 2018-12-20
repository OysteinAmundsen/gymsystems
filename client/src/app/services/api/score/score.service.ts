import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IScore, ITeamInDiscipline, Operation } from 'app/model';
import { Helper } from '../Helper';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScoreService {
  url = '/api/score/participant';

  constructor(private http: HttpClient) { }

  /**
   *
   */
  removeFromParticipant(participantId: number) {
    return this.http.delete(`${this.url}/${participantId}`);
  }

  /**
   *
   */
  rollbackToParticipant(participantId: number) {
    return this.http.get(`${this.url}/${participantId}/rollback`);
  }

  /**
   *
   */
  calculateScoreGroupTotal(participant: ITeamInDiscipline, type: string) {
    const add = (prev, num) => { prev += num; return prev; };
    const sub = (prev, num) => { prev -= num; return prev; };
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
   */
  fixScore(score) {
    const fixedVal = (Math.ceil(score * 20) / 20).toFixed(2);
    return parseFloat(fixedVal);
  }
}
