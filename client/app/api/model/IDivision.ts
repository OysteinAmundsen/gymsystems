import { ITeam } from './ITeam';

export interface IDivision {
  id: number;
  name: string;
  teams?: ITeam[];
}
