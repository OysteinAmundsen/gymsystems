import { ITeamInDiscipline } from './ITeamInDiscipline';
import { IScoreGroup } from './IScoreGroup';

export interface IScore {
  id: number;
  value: number;
  scoreGroupId: number;
  scoreGroup: IScoreGroup;
  judgeIndex: number;
  participantId: number;
  participant: ITeamInDiscipline;
}
