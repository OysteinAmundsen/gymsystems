import { ITournamentParticipant } from './ITournamentParticipant';
import { ITournamentDiscipline } from './ITournamentDiscipline';
import { ITournamentScoreGroup } from './ITournamentScoreGroup';
import * as moment from 'moment';
import Moment = moment.Moment;

export interface ITournament {
  id: number;
  name: string;
  description: string;
  startDate: Date | Moment | string;
  endDate: Date | Moment | string;
  location: string;
  image: string;
  schedule?: ITournamentParticipant[];
  disciplines?: ITournamentDiscipline[];
  scoreGroups?: ITournamentScoreGroup[];
}
