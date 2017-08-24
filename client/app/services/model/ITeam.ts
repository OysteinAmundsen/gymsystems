import { ITournament } from './ITournament';
import { IDiscipline } from './IDiscipline';
import { IDivision } from './IDivision';
import { Classes } from './Classes';
import { ITroop } from './ITroop';

export interface ITeam extends ITroop {
  class: Classes;
  divisions: IDivision[];
  disciplines: IDiscipline[];
  tournament: ITournament;
}
