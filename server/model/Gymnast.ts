import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, Index, OneToMany } from 'typeorm';
import { Club, BelongsToClub } from './Club';
import { DivisionType } from './Division';
import { Team } from './Team';
import { Troop } from './Troop';

/**
 * Defines the available genders
 *
 * @export
 * @enum Gymnast
 */
export enum Gender {
  Male = 1, Female = 2
}

/**
 * Defines one performer in a troop/team.
 * Clubs are encouraged to enter all performers registerred
 * to their club. At least the ones performing in competitive
 * events. This will allow the clubs to get calculated statistics
 * over time.
 *
 * @export
 * @enum Gymnast
 */
@Entity()
export class Gymnast implements BelongsToClub {
  /**
   * The Gymnast primary key
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The full name of the performer
   */
  @Column({ length: 100 })
  name: string;

  /**
   * The birth year of the performer will allow
   * the system to automatically calculate which
   * Age Division this performer can be entered in.
   *
   * This opens for automatic troop/team generation.
   */
  @Column()
  birthYear: number;

  /**
   * The gender of the performer will allow the system
   * to automatically calculate which Gender divisions
   * this performer can be entered in.
   *
   * This opens for automatic troop/team generation
   */
  @Column()
  gender: Gender;

  /**
   * A reference to troops this perfomer is a part of
   */
  @ManyToMany(type => Troop, troop => troop.gymnasts, { cascadeInsert: false, cascadeUpdate: false })
  @JoinTable()
  troop: Troop[];

  /**
   * A reference to teams this perfomer is/has been a part of
   */
  @ManyToMany(type => Team, team => team.gymnasts, { cascadeInsert: false, cascadeUpdate: false })
  @JoinTable()
  team: Team[];

  /**
   * A reference to the club this perfomer is registerred under
   */
  @ManyToOne(type => Club, club => club.teams, { nullable: false })
  club: Club;

}
