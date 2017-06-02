import { IScoreGroup } from 'app/services/model/IScoreGroup';
import { ITeamInDisciplineScore } from 'app/services/model/ITeamInDisciplineScore';

export interface IScoreContainer {
  group: IScoreGroup;
  scores: ITeamInDisciplineScore[];
  avg?: number;
  total?: number;
}
