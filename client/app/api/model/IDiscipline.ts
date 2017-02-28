import { IScoreGroup } from './IScoreGroup';
import { ITournament } from './ITournament';
import { ITeam } from './ITeam';

export interface IDiscipline {
  id: number;
  name: string;
  sortOrder: number;
  teams?: ITeam[];
  tournament: ITournament;
  scoreGroups: IScoreGroup[];
}
