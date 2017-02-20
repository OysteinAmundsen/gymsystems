import { IAgeClass } from './IAgeClass';
import { IDiscipline } from './IDiscipline';
import { IClass } from './IClass';
export interface ITeam {
  id: number;
  name: string;
  clazz: IClass;
  ageClass: IAgeClass;
  disciplines?: IDiscipline[];
}
