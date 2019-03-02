import { Operation } from '../score-group.model';
import { JudgeInScoreGroup } from 'api/graph/judge-in-score-group/judge-in-score-group.model';

export class ScoreGroupDto {
  id: number;
  name: string;
  type: string;
  operation: Operation;
  max?: number;
  min?: number;
  disciplineId: number;
  sortOrder: number;
  judges?: JudgeInScoreGroup[];
}
