import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, Index, OneToMany, JoinColumn } from 'typeorm';
import { Club, BelongsToClub } from './Club';
import { DivisionType } from './Division';
import { Team } from './Team';
import { Troop } from './Troop';
import { Tournament } from './Tournament';

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
@Index('gymnast_club_name', (gymnast: Gymnast) => [gymnast.name, gymnast.club], { unique: true })
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
   * Will replace the birthYear property in the near future
   */
  @Column({ nullable: true})
  birthDate: Date;

  /**
   * Email address of this gymnast
   */
  @Column({ nullable: true})
  email: string;

  /**
   * Phone number of this gymnast
   */
  @Column({ nullable: true})
  phone: number;

  /**
   * The gender of the performer will allow the system
   * to automatically calculate which Gender divisions
   * this performer can be entered in.
   *
   * This opens for automatic troop/team generation
   */
  @Column()
  gender: Gender;

  @Column({ nullable: true})
  allergies: string;

  /**
   * Name of a parent or a legal guardian for this gymnast
   */
  @Column({ nullable: true})
  guardian1: string;

  /**
   * Name of a parent or a legal guardian for this gymnast
   */
  @Column({ nullable: true})
  guardian2: string;

  /**
   * Phone number of a parent or a legal guardian for this gymnast
   */
  @Column({ nullable: true})
  guardian1Phone: number;

  /**
   * Phone number of a parent or a legal guardian for this gymnast
   */
  @Column({ nullable: true})
  guardian2Phone: number;

  /**
   * Email of a parent or a legal guardian for this gymnast
   */
  @Column({ nullable: true})
  guardian1Email: string;

  /**
   * Email of a parent or a legal guardian for this gymnast
   */
  @Column({ nullable: true})
  guardian2Email: string;

  /**
   * A reference to troops this perfomer is a part of
   */
  @ManyToMany(type => Troop, troop => troop.gymnasts, { cascadeInsert: false, cascadeUpdate: false })
  @JoinTable({name: 'gymnast_troop_troop_id'})
  troop: Troop[];

  /**
  * A reference to teams this perfomer is/has been a part of
  */
  @ManyToMany(type => Team, team => team.gymnasts, { cascadeInsert: false, cascadeUpdate: false })
  @JoinTable({name: 'gymnast_team_team_id'})
  team: Team[];

  /**
  * A reference to the club this perfomer is registerred under
  */
  @ManyToOne(type => Club, club => club.gymnasts, { nullable: false })
  @JoinColumn({name: 'club'})
  club: Club;
}
