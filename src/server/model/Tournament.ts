import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';

import { Discipline } from './Discipline';
import { Division } from './Division';
import { Team } from './Team';
import { TeamInDiscipline } from './TeamInDiscipline';
import { User, CreatedBy } from './User';
import { Media } from './Media';
import { BelongsToClub, Club } from './Club';
import { Venue } from './Venue';
import { Gymnast } from './Gymnast';

/**
 * A Tournament describes a competitive event created and arranged by
 * a club, where the aim is for troops in the creators and other clubs
 * to compete against each other according to the rules specified by the NGTF.
 *
 * A Tournament must define which age and gender divisions it will allow, and
 * which disciplines troops can compete in.
 *
 * @export
 * @class Tournament
 */
@Entity()
export class Tournament implements CreatedBy, BelongsToClub {

  /**
   * The tournament primary key
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * This field is automatically created when a user creates a new
   * event.
   */
  @ManyToOne(type => User, user => user.tournaments, {nullable: false})
  @JoinColumn({name: 'createdBy'})
  createdBy: User;

  /**
   *
   */
  @ManyToOne(type => Club, club => club.tournaments, {nullable: true})
  @JoinColumn({name: 'club'})
  club: Club;

  /**
   * The tournaments unique string identifier. Also the header everywhere
   * tournament data is presented.
   */
  @Column('varchar', { unique: true, length: 200 })
  name: string;

  /**
   * Norwegian description in markdown
   */
  @Column({ type: 'text', nullable: true })
  description_no: string;

  /**
   * English description in markdown
   */
  @Column({ type: 'text', nullable: true })
  description_en: string;

  /**
   * The date for the first day of the event
   */
  @Column('datetime')
  startDate: Date;

  /**
   * The date for the last day of the event
   */
  @Column('datetime')
  endDate: Date;

  /**
   * An array of timespans, describing the start and end time for
   * each day in the event.
   */
  @Column({type: 'json', nullable: true})
  times: {day: number, time: string}[];

  /**
   * This is the actual tournament schedule. It contains a list of
   * teams in disciplines. If a team is competing in one discipline, it
   * will only appear once in this list. If a team is competing in three
   * disciplines, it will appear three times in this list.
   *
   * The list is sorted by order of appearence. First in list is first on
   * the floor.
   */
  @OneToMany(type => TeamInDiscipline, schedule => schedule.tournament, { cascadeInsert: false, cascadeUpdate: false })
  schedule: TeamInDiscipline[];

  /**
   * Contains a list of disciplines available to compete in in this
   * tournament. This allows the club arranging the event to limit
   * clubs to enter in only certain disciplines.
   *
   * By default all known disciplines are enabled, but a club can actually
   * also define custom disciplines if they want.
   */
  @OneToMany(type => Discipline, disciplines => disciplines.tournament, { cascadeInsert: true })
  disciplines: Discipline[];

  /**
   * Contains a list of divisions (age and gender) available to compete
   * in in this tournament. This allows the club arranging the event to
   * limit clubs to enter only senior gymnasts for instance.
   */
  @OneToMany(type => Division, divisions => divisions.tournament, { cascadeInsert: true })
  divisions: Division[];

  /**
   * The list of teams registerred to compete in this tournament.
   */
  @OneToMany(type => Team, teams => teams.tournament, { cascadeInsert: false, cascadeUpdate: false })
  teams: Team[];

  /**
   * The media registerred to be played in this tournament.
   */
  @OneToMany(type => Media, media => media.tournament, { cascadeInsert: false, cascadeUpdate: false })
  media: Media[];

  /**
   * An object specifying the location of the event.
   */
  @ManyToOne(type => Venue, venue => venue.tournaments)
  @JoinColumn({name: 'venue'})
  venue: Venue;


  // LODGING -----------------------------------------------------
  /**
   * The number of gymnasts this tournament can be able to provide
   * lodging for.
   */
  @Column('tinyint', { default: true })
  providesLodging: boolean;

  // /**
  //  * The price for lodging per head. This will be covered by
  //  * the entry fee for the tournament, and split between all teams
  //  * entering.
  //  */
  // @Column({ default: 0 })
  // lodingCostPerHead: number;

  /**
   * The actual list of gymnasts signed up for lodging
   */
  @ManyToMany(type => Gymnast, gymnasts => gymnasts.lodging)
  @JoinTable()
  lodging: Gymnast[];


  // TRANSPORT ---------------------------------------------------
  /**
   * If true, this tournament can provide transportation for
   * traveling gymnasts.
   */
  @Column('tinyint', { default: false })
  providesTransport: boolean;

  // /**
  //  * The price for transportation per head. This will be covered by
  //  * the entry fee for the tournament, and split between all teams
  //  * entering.
  //  */
  // @Column({ default: 0 })
  // transportationCostPerHead: number;

  /**
   * The list of gymnasts requiering transportation to the venue
   */
  @ManyToMany(type => Gymnast, gymnasts => gymnasts.transport)
  @JoinTable()
  transport: Gymnast[];



  // BANQUET -----------------------------------------------------
  /**
   * If true, this tournament will throw a banquet in honor of the
   * performing gymnasts.
   */
  @Column('tinyint', { default: false })
  providesBanquet: boolean;

  // /**
  //  * The price for the banquet per head. This will be covered by
  //  * the entry fee for the tournament, and split between all teams
  //  * entering.
  //  */
  // @Column({ default: 0 })
  // banquetCostPerHead: number;

  /**
   * The list of gymnasts attending the banquet
   */
  @ManyToMany(type => Gymnast, gymnasts => gymnasts.banquet, { cascadeInsert: false, cascadeUpdate: false })
  @JoinTable()
  banquet: Gymnast[];

}
