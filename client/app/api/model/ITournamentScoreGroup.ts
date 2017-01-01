import { ITournamentParticipantScore } from './ITournamentParticipantScore';
import { IScoreGroup } from './IScoreGroup';
import { ITournament } from './ITournament';

export interface ITournamentScoreGroup {
  id: number;
  scoreGroup: IScoreGroup;
  scores: ITournamentParticipantScore[];
  tournament: ITournament;
  avg?: number;
  total?: number;
}
