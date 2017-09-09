import { ITeam } from './ITeam';
import { IBelongsToClub } from './IBelongsToClub';
import { IGymnast } from './IGymnast';
import { IUser } from './IUser';

export interface IClub extends IBelongsToClub {
  id: number;
  name: string;
  teams: ITeam[];
  users: IUser[];
  gymnasts: IGymnast[];
}

