import { IScoreGroup, IScore } from 'app/model';

export interface IScoreContainer {
  group: IScoreGroup;
  scores: IScore[];
  avg?: number;
  total?: number;
}

export class ScoreContainer implements IScoreContainer {
  get total(): number {
    return this.scores.reduce((prev, curr) => prev += curr.value, 0);
  }
  get avg(): number {
    return this.total / this.scores.length;
  }
  constructor(public group: IScoreGroup, public scores: IScore[]) { }
}
