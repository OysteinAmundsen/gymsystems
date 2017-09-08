import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, ManyToOne, JoinTable, Index } from 'typeorm';

import { Tournament } from './Tournament';
import { Team } from './Team';

/**
 * Describe the type of division
 *
 * @export
 * @enum DivisionType
 */
export enum DivisionType {
  Age = 1, Gender = 2
}


/**
 * A Division object describes one half of the actual division
 * the gymnasts are competing in. You will need a division pair
 * in order to get the whole picture.
 *
 * A gymnast competes in an Age/Gender type division. So the gymnast
 * is both in a Age Division and in a Gender division. The age division
 * is locked by physical age of the gymnast, but a gender division can
 * be both the actual gender of the gymnast as well as a special division
 * called 'Mix'.
 *
 * To elaborate, "John Gymnast" can be both in:
 *  - Rekrutt Herrer
 *  - Rekrutt Mix
 * where 'Rekrutt' is the Age division and 'Herrer'/'Mix' is the gender
 * division.
 *
 * @export
 * @enum DivisionType
 */
@Entity()
@Index('division_tournament_name', (division: Division) => [division.name, division.tournament], { unique: true })
export class Division {
  /**
   * The Division primary key
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * A descriptive name for this division
   */
  @Column()
  name: string;

  /**
   * A numeric representation of how this object should be sorted
   */
  @Column({ default: 0 })
  sortOrder?: number;

  /**
   * Define if this is a Gender type or Age type division
   */
  @Column()
  type: DivisionType;

  /**
   * A reference to the teams competing in this division
   */
  @ManyToMany(type => Team, teams => teams.divisions)
  teams: Team[];

  /**
   * The tournament where this division is to be competed in
   */
  @ManyToOne(type => Tournament, tournament => tournament.divisions, { nullable: false, cascadeRemove: true })
  tournament: Tournament;
}
