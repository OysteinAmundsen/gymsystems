import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { Tournament } from './Tournament';
import { Discipline } from './Discipline';
import { ScoreGroup } from './ScoreGroup';
import { JudgeInScoreGroup } from './JudgeInScoreGroup';

/**
* Defines one judge.
*
* @export
*/
@Entity()
export class Judge {
  /**
  * The Judge primary key
  */
  @PrimaryGeneratedColumn()
  id: number;

  /**
  * The full name of the judge
  */
  @Column({ unique: true, length: 100 })
  name: string;

  /**
   * Email address of this judge
   */
  @Column({ nullable: true})
  email: string;

  /**
   * Phone number of this judge
   */
  @Column({ nullable: true})
  phone: string;

  /**
   *
   */
  @Column({ nullable: true})
  allergies: string;

  /**
   *
   */
  @OneToMany(type => JudgeInScoreGroup, scoreGroup => scoreGroup.judge)
  scoreGroups: JudgeInScoreGroup[];
}
