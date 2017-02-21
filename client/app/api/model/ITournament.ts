import { IDiscipline } from './IDiscipline';
import { ITournamentParticipant } from './ITournamentParticipant';

import * as moment from 'moment';
import Moment = moment.Moment;

export interface ITournament {
  id: number;
  name: string;
  description: string;
  startDate: Date | Moment | string;
  endDate: Date | Moment | string;
  location: string;
  schedule?: ITournamentParticipant[];
  disciplines?: IDiscipline[];
}