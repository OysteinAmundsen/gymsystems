import { IScoreGroup, ITeamInDisciplineScore } from 'app/services/model';

export interface IScoreContainer {
  group: IScoreGroup;
  scores: ITeamInDisciplineScore[];
  avg?: number;
  total?: number;
}
