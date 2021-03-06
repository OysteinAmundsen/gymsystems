import { DivisionType } from './DivisionType';
import { ITournament } from './ITournament';
import { ITeam } from './ITeam';

export interface IDivision {
  id: number;
  name: string;
  sortOrder: number;
  min?: number;
  max?: number;
  scorable: boolean;
  type: DivisionType;
  teams: ITeam[];
  tournamentId: number;
  tournament: ITournament;
}
