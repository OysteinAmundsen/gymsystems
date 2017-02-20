import { ITournamentParticipant } from './ITournamentParticipant';
import { IScoreGroup } from './IScoreGroup';

export interface ITournamentParticipantScore {
  id: number;
  value: number;
  group: IScoreGroup;
  participant: ITournamentParticipant;
}
