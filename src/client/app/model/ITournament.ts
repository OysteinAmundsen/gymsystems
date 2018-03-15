
import * as moment from 'moment';

import { IUser } from './IUser';
import { IMedia } from './IMedia';
import { IDivision } from './IDivision';
import { IDiscipline } from './IDiscipline';
import { ITeamInDiscipline } from './ITeamInDiscipline';
import { IClub } from './IClub';

import { IBelongsToClub } from './IBelongsToClub';
import { ICreatedBy } from './ICreatedBy';
import { IVenue } from './IVenue';
import { IGymnast } from 'app/model';

export interface ITournament extends IBelongsToClub, ICreatedBy {
  id: number;
  name: string;
  description_no: string;
  description_en: string;
  startDate: Date | moment.Moment | string;
  endDate: Date | moment.Moment | string;
  times: {day: number, time: string}[];
  venue: IVenue;
  schedule: ITeamInDiscipline[];
  disciplines: IDiscipline[];
  divisions: IDivision[];
  media: IMedia[];


  // // LODGING -----------------------------------------------------
  providesLodging: boolean;
  // lodingCostPerHead: number;
  // lodging: IGymnast[];


  // // TRANSPORT ---------------------------------------------------
  providesTransport: boolean;
  // transportationCostPerHead: number;
  // transporting: IGymnast[];


  // // BANQUET -----------------------------------------------------
  providesBanquet: boolean;
  // banquetCostPerHead: number;
  // banquetFor: IGymnast[];
}
