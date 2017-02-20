import { ITeam } from './ITeam';
export interface IAgeClass {
  id: number;
  name: string;
  teams?: ITeam[];
}
