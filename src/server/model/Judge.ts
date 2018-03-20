import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { Tournament } from './Tournament';
import { Discipline } from './Discipline';
import { ScoreGroup } from './ScoreGroup';
import { JudgeInScoreGroup } from './JudgeInScoreGroup';
import { Person } from './Person';

/**
* Defines one judge.
*
* @export
*/
@Entity()
export class Judge extends Person {
  /**
   *
   */
  @OneToMany(type => JudgeInScoreGroup, scoreGroup => scoreGroup.judge)
  scoreGroups: JudgeInScoreGroup[];
}
