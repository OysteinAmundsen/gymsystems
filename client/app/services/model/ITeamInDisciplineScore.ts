import { ITeamInDiscipline } from './ITeamInDiscipline';
import { IScoreGroup } from './IScoreGroup';

export interface ITeamInDisciplineScore {
  id: number;
  value: number;
  scoreGroup: IScoreGroup;
  judgeIndex: number;
  participant: ITeamInDiscipline;
}
