
import * as moment from 'moment';
import Moment = moment.Moment;

import { IUser } from './IUser';
import { IMedia } from './IMedia';
import { IDivision } from './IDivision';
import { IDiscipline } from './IDiscipline';
import { ITournamentParticipant } from './ITournamentParticipant';

export interface ITournament {
  id: number;
  createdBy: IUser;
  name: string;
  description_no: string;
  description_en: string;
  startDate: Date | Moment | string;
  endDate: Date | Moment | string;
  times: {day: Date | Moment, time: string}[];
  location: string;
  schedule: ITournamentParticipant[];
  disciplines: IDiscipline[];
  divisions: IDivision[];
  media: IMedia[];
}
