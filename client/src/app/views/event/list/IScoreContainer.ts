import { IScoreGroup, IScore } from 'app/model';

export interface IScoreContainer {
  // group: IScoreGroup;
  scoreGroupId: number;
  scoreGroup: IScoreGroup;
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
  constructor(public scoreGroupId: number, public scoreGroup: IScoreGroup, public scores: IScore[]) { }
}
