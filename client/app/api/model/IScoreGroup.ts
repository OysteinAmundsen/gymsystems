import { Operation } from './Operation';
import { IDiscipline } from './IDiscipline';

export interface IScoreGroup {
  id: number;
  name: string;
  type: string;
  judges: number;
  max: number;
  min: number;
  discipline: IDiscipline;
  operation: Operation;
}
