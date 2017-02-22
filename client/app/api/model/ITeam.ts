import { IAgeClass } from './IAgeClass';
import { IDiscipline } from './IDiscipline';
import { IDivision } from './IDivision';

export interface ITeam {
  id: number;
  name: string;
  division: IDivision;
  ageClass: IAgeClass;
  disciplines?: IDiscipline[];
}
