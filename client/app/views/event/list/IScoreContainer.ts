import { IScoreGroup, IScore } from 'app/model';

export interface IScoreContainer {
  group: IScoreGroup;
  scores: IScore[];
  avg?: number;
  total?: number;
}
