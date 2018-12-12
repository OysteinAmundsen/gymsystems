import { ITeam } from './ITeam';
import { IGymnast } from './IGymnast';
import { IUser } from './IUser';

export interface IClub {
  id: number;
  name: string;
  teams: ITeam[];
  users: IUser[];
  gymnasts: IGymnast[];
}

