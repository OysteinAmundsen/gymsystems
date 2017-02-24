import { IDiscipline } from './IDiscipline';
import { IDivision } from './IDivision';

export interface ITeam {
  id: number;
  name: string;
  divisions: IDivision[];
  disciplines: IDiscipline[];
}
