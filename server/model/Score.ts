import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { TeamInDiscipline } from './TeamInDiscipline';
import { ScoreGroup } from './ScoreGroup';

/**
 * One score per participant and scoregroup.
 *
 * For each `Scoregroup` a sum of all score values should be calculated.
 * For each `Team` a sum total of all score values from every scoregroup should be calculated.
 *
 * @export
 * @class Score
 */
@Entity()
export class Score {
  /**
   * The scores primary key
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The actual score. The score must be greater than 0, and less than
   * the configured maximum score value this tournament defines.
   * Values can be decimals, but must be rounded upwards to the nearest 0.05
   */
  @Column()
  value: number;

  /**
   * Specifies the timestamp this score is created/updated
   */
  @UpdateDateColumn({ nullable: true})
  updated?: Date;

  /**
   * The `ScoreGroup` this score affects.
   */
  @ManyToOne(type => ScoreGroup, { nullable: false, cascadeRemove: false, onDelete: 'CASCADE' })
  scoreGroup: ScoreGroup;

  /**
   * Together with the `ScoreGroup`, this identifies the judge
   * that gave the score.
   *
   * For instance for ScoreGroup 'E' and judgeIndex 1, this score
   * is delivered from judge E1 - which is the master judge for
   * Execution.
   */
  @Column({ nullable: true })
  judgeIndex: number;

  /**
   * The reference back to the schedule. This identifies the `Team`
   * in the given discipline.
   */
  @ManyToOne(type => TeamInDiscipline, participant => participant.scores, {
    nullable: false, cascadeInsert: false, cascadeUpdate: false, cascadeRemove: false, onDelete: 'CASCADE'
  })
  participant: TeamInDiscipline;
}

