import { ITeam } from './ITeam';

export interface IClub {
  id: number;
  name: string;
  teams: ITeam[];
}
