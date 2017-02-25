import { DivisionType } from './DivisionType';
import { ITournament } from './ITournament';
import { ITeam } from './ITeam';

export interface IDivision {
  id: number;
  name: string;
  type: DivisionType;
  teams: ITeam[];
  tournament: ITournament;
}
