import { IScore } from './iScore';

export interface IScoreGroup {
  header: string;
  type: string;
  scores: IScore[];
  avg?: number;
  total?: number;
}
