import { ITournamentParticipant } from './ITournamentParticipant';
import { ITournamentScoreGroup } from './ITournamentScoreGroup';

export interface ITournamentParticipantScore {
  id: number;
  value: number;
  group: ITournamentScoreGroup;
  participant: ITournamentParticipant;
}
