import { DivisionType } from './DivisionType';
import { ITournament } from './ITournament';
import { ITeam } from './ITeam';

export interface IDivision {
  id: number;
  name: string;
  sortOrder: number;
  min?: number;
  max?: number;
  type: DivisionType;
  teams: ITeam[];
  tournament: ITournament;
}
