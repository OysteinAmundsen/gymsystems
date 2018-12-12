import { Operation } from '../score-group.model';

export class ScoreGroupDto {
  id: number;
  name: string;
  type: string;
  operation: Operation;
  max?: number;
  min?: number;
  disciplineId: number;
  judges?: { judgeId: number, scoreGroupId: number }[];
}
