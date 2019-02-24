import { IJudge } from './IJudge';
import { IScoreGroup } from './IScoreGroup';

/**
 * Resolves many-to-many relation between `Judge` and `ScoreGroup`.
 * This is done in order to save the ordering of judges within the scoregroup.
 *
 * @export
 */
export interface IJudgeInScoreGroup {
  scoreGroupId: number;
  scoreGroup: IScoreGroup;
  judge: IJudge;
  sortNumber: number;
}
