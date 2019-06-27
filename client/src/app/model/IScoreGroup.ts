import { Operation } from './Operation';
import { IDiscipline } from './IDiscipline';
import { IJudgeInScoreGroup } from './IJudgeInScoreGroup';


export interface IScoreGroup {
  id: number;
  name: string;
  type: string;
  sortOrder?: number;
  judges: IJudgeInScoreGroup[];
  judgeCount?: number;
  max: number;
  min: number;
  disciplineId: number;
  discipline?: IDiscipline;
  operation: Operation;
}
