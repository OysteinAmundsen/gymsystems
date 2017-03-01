import { IScoreGroup } from 'app/api/model/IScoreGroup';
import { ITournamentParticipantScore } from 'app/api/model/ITournamentParticipantScore';

export interface IScoreContainer {
  group: IScoreGroup;
  scores: ITournamentParticipantScore[];
  avg?: number;
}
