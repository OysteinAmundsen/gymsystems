import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, Index, OneToMany, JoinColumn } from 'typeorm';
import { Club, BelongsToClub } from './Club';
import { DivisionType } from './Division';
import { Team } from './Team';
import { Troop } from './Troop';
import { Tournament } from './Tournament';
import { Person } from './Person';

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
*/
@Entity()
@Index('gymnast_club_name', (gymnast: Gymnast) => [gymnast.name, gymnast.club], { unique: true })
export class Gymnast extends Person implements BelongsToClub {
  /**
  * The birth year of the performer will allow
  * the system to automatically calculate which
  * Age Division this performer can be entered in.
  *
  * This opens for automatic troop/team generation.
  */
  @Column('int')
  birthYear: number;

  /**
   * Will replace the birthYear property in the near future
   */
  @Column('datetime', { nullable: true})
  birthDate: Date;

  /**
   * The gender of the performer will allow the system
   * to automatically calculate which Gender divisions
   * this performer can be entered in.
   *
   * This opens for automatic troop/team generation
   */
  @Column('int')
  gender: Gender;

  /**
   * Name of a parent or a legal guardian for this gymnast
   */
  @Column('varchar', { nullable: true})
  guardian1: string;

  /**
   * Name of a parent or a legal guardian for this gymnast
   */
  @Column('varchar', { nullable: true})
  guardian2: string;

  /**
   * Phone number of a parent or a legal guardian for this gymnast
   */
  @Column('varchar', { nullable: true})
  guardian1Phone: string;

  /**
   * Phone number of a parent or a legal guardian for this gymnast
   */
  @Column('varchar', { nullable: true})
  guardian2Phone: string;

  /**
   * Email of a parent or a legal guardian for this gymnast
   */
  @Column('varchar', { nullable: true})
  guardian1Email: string;

  /**
   * Email of a parent or a legal guardian for this gymnast
   */
  @Column('varchar', { nullable: true})
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

  @ManyToMany(type => Tournament, tournament => tournament.lodging)
  lodging: Tournament[];

  @ManyToMany(type => Tournament, tournament => tournament.transport)
  transport: Tournament[];

  @ManyToMany(type => Tournament, tournament => tournament.banquet)
  banquet: Tournament[];
}
