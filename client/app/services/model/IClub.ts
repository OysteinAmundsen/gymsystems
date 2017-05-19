import { ITeam } from './ITeam';
import { IBelongsToClub } from './IBelongsToClub';

export interface IClub extends IBelongsToClub {
  id: number;
  name: string;
  teams: ITeam[];
}

