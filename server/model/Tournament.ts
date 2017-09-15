import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

import { Discipline } from './Discipline';
import { Division } from './Division';
import { Team } from './Team';
import { TeamInDiscipline } from './TeamInDiscipline';
import { User, CreatedBy } from './User';
import { Media } from './Media';
import { BelongsToClub, Club } from './Club';
import { Venue } from './Venue';

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
  @Column({ unique: true, length: 200 })
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
  @Column()
  startDate: Date;

  /**
   * The date for the last day of the event
   */
  @Column()
  endDate: Date;

  /**
   * An array of timespans, describing the start and end time for
   * each day in the event.
   */
  @Column({type: 'json', nullable: true})
  times: {day: number, time: string}[];

  /**
   * A string hinting to the location of the event. This can be a city,
   * or a venue in a city. All the information the creator of the event
   * sees fit to give in order to guide competitors to where the event
   * is held.
   *
   * NOTE: This might change to a google maps url at some point.
   */
  @Column()
  location: string;

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

  @ManyToOne(type => Venue, venue => venue.tournaments)
  venue: Venue;
}
