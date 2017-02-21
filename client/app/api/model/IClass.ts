import { ITeam } from './ITeam';

export interface IClass {
  id: number;
  name: string;
  teams?: ITeam[];
}
