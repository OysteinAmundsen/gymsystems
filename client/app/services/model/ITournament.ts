
import * as moment from 'moment';

import { IUser } from './IUser';
import { IMedia } from './IMedia';
import { IDivision } from './IDivision';
import { IDiscipline } from './IDiscipline';
import { ITeamInDiscipline } from './ITeamInDiscipline';
import { IClub } from './IClub';

export interface ITournament {
  id: number;
  createdBy: IUser;
  club: IClub;
  name: string;
  description_no: string;
  description_en: string;
  startDate: Date | moment.Moment | string;
  endDate: Date | moment.Moment | string;
  times: {day: Date | moment.Moment, time: string}[];
  location: string;
  schedule: ITeamInDiscipline[];
  disciplines: IDiscipline[];
  divisions: IDivision[];
  media: IMedia[];
}
