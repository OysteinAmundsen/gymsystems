import { ITournament } from './ITournament';
import { ITeam } from './ITeam';

export enum DivisionType {
  Age = 1, Gender = 2
}

export interface IDivision {
  id: number;
  name: string;
  type: DivisionType;
  teams: ITeam[];
  tournament: ITournament;
}
