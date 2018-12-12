import { Operation } from './Operation';
import { IDiscipline } from './IDiscipline';
import { IJudge } from './IJudge';
import { IJudgeInScoreGroup } from './IJudgeInScoreGroup';

export interface IScoreGroup {
  id: number;
  name: string;
  type: string;
  judges: IJudgeInScoreGroup[];
  judgeCount?: number;
  max: number;
  min: number;
  disciplineId: number;
  discipline?: IDiscipline;
  operation: Operation;
}
