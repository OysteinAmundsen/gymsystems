
export class ScoreDto {
  id: number;
  value: number;
  updated: Date;
  judgeIndex?: number;
  scoreGroup: { id: number };
  participant: { id: number };
}
