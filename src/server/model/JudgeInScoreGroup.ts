import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToOne, JoinColumn, Index, PrimaryColumn, ManyToOne } from 'typeorm';
import { ScoreGroup } from './ScoreGroup';
import { Judge } from './Judge';

/**
 * Resolves many-to-many relation between `Judge` and `ScoreGroup`.
 * This is done in order to save the ordering of judges within the scoregroup.
 *
 * @export
 */
@Entity({name: 'score_group_judges_judge'})
export class JudgeInScoreGroup {
  /**
   *
   */
  @ManyToOne(type => ScoreGroup, { nullable: false, primary: true })
  scoreGroup: ScoreGroup;

  /**
   *
   */
  @ManyToOne(type => Judge, { nullable: false, primary: true })
  judge: Judge;

  /**
   *
   */
  @Column('int')
  sortNumber: number;
}
