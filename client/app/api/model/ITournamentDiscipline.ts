import { ITournament } from './ITournament';
import { IDiscipline } from './IDiscipline';

export interface ITournamentDiscipline {
  id: number;
  discipline: IDiscipline;
  tournament: ITournament;
}
