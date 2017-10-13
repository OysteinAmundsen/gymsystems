import { Discipline } from './Discipline';
import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

/**
 * Defines the type of operation the application should perform when
 * calculating the total of this scoregroup. Should scores in this
 * group be added or subtracted from the total.
 *
 * @export
 * @class ScoreGroup
 */
export enum Operation {
  Addition = 1, Subtraction = 2
}

/**
 * Defines one ScoreGroup type.
 *
 * The ScoreGroup definitions can vary between tournaments
 * and disciplines, but the standard is that a `Team` is
 * judged in 3 different categories:
 *
 *  - Composition C
 *  - Execution   E
 *  - Difficulty  D
 *
 * and as a standard, there is also one special group which defines
 * point withdrawls HJ.
 *
 * @export
 * @class ScoreGroup
 */
@Entity()
export class ScoreGroup {
  /**
   * The ScoreGroups primary key
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The extended name of the group. i.e. 'Execution'
   */
  @Column({ length: 50 })
  name: string;

  /**
   * The shortname of the gtoup. i.e. 'E'
   */
  @Column()
  type: string;

  /**
   * Wheather this group defines scores which will be added to the total,
   * or subtracted from the total
   */
  @Column()
  operation: Operation = Operation.Addition;

  /**
   * Contains the number of judges responsible for giving score
   * in this group. For large events, the standard is usually:
   *
   *  - D - 2 judges
   *  - E - 4 judges
   *  - C - 2 judges
   *
   * All judges can enter 'HJ' scores (withdrawls), but usually don't.
   */
  @Column()
  judges: number;

  /**
   * The maximum point which can be given in this scoregroup.
   *
   * The rules stated by NGTF are quite clear on this, but we provide
   * this as a configurable option for events nontheless, as smaller
   * events may operate under custom rules if they want.
   */
  @Column()
  max: number;

  /**
   * The minimum point which can be given in this scoregroup.
   *
   * The rules stated by NGTF are quite clear on this, but we provide
   * this as a configurable option for events nontheless, as smaller
   * events may operate under custom rules if they want.
   */
  @Column()
  min: number;

  /**
   * The `Discipline` bound by these rules. By having this relation,
   * we can effectivelly have one set of ScoreGroup definitions per
   * discipline, which makes the system very versatile and configurable.
   *
   * We do however provide the NGTF standard as default, so an event creator
   * won't have to configure him-/herself to death.
   */
  @ManyToOne(type => Discipline, discipline => discipline.scoreGroups, { nullable: false })
  @JoinColumn({name: 'discipline'})
  discipline: Discipline;
}
