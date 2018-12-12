import { IScoreGroup } from './IScoreGroup';
import { ITournament } from './ITournament';
import { ITeam } from './ITeam';
import { IJudge } from './IJudge';
import { IJudgeInScoreGroup } from './IJudgeInScoreGroup';

export interface IDiscipline {
  judges: IJudgeInScoreGroup[];
  judgesPlain: IJudge[];
  id: number;
  name: string;
  sortOrder?: number;
  teams?: ITeam[];
  tournamentId: number;
  tournament: ITournament;
  scoreGroups: IScoreGroup[];
}
