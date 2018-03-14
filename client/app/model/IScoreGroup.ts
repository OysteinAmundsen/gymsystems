import { Operation } from './Operation';
import { IDiscipline } from './IDiscipline';
import { IJudge } from './IJudge';

export interface IScoreGroup {
  id: number;
  name: string;
  type: string;
  judges: IJudge[];
  max: number;
  min: number;
  discipline: IDiscipline;
  operation: Operation;
}
