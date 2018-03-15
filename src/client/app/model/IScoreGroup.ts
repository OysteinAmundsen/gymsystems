import { Operation } from './Operation';
import { IDiscipline } from './IDiscipline';
import { IJudge } from './IJudge';
import { IJudgeInScoreGroup } from './IJudgeInScoreGroup';

export interface IScoreGroup {
  id: number;
  name: string;
  type: string;
  judges: IJudgeInScoreGroup[];
  max: number;
  min: number;
  discipline: IDiscipline;
  operation: Operation;
}
