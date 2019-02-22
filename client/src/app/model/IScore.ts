import { ITeamInDiscipline } from './ITeamInDiscipline';
import { IScoreGroup } from './IScoreGroup';

export interface IScore {
  updated: Date;
  id: number;
  value: number;
  scoreGroupId: number;
  scoreGroup: IScoreGroup;
  judgeIndex: number;
  participantId: number;
  participant: ITeamInDiscipline;
}
