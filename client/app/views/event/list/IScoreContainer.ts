import { IScoreGroup, IScore } from 'app/services/model';

export interface IScoreContainer {
  group: IScoreGroup;
  scores: IScore[];
  avg?: number;
  total?: number;
}
