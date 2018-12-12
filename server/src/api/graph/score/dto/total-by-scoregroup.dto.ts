import { ScoreGroup } from 'api/graph/score-group/score-group.model';

export interface TotalByScoreGroup {
  group: ScoreGroup,
  total: number
}
