import { IScoreGroup } from 'app/services/model/IScoreGroup';
import { ITournamentParticipantScore } from 'app/services/model/ITournamentParticipantScore';

export interface IScoreContainer {
  group: IScoreGroup;
  scores: ITournamentParticipantScore[];
  avg?: number;
  total?: number;
}
