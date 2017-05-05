import { IDivision } from './IDivision';
import { IDiscipline } from './IDiscipline';
import { ITournamentParticipant } from './ITournamentParticipant';

import * as moment from 'moment';
import { IUser } from "app/services/model/IUser";
import Moment = moment.Moment;

export interface ITournament {
  id: number;
  createdBy: IUser;
  name: string;
  description: string;
  startDate: Date | Moment | string;
  endDate: Date | Moment | string;
  location: string;
  schedule: ITournamentParticipant[];
  disciplines: IDiscipline[];
  divisions: IDivision[];
}
