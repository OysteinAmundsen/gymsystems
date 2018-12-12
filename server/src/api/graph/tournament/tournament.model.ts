import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { TeamInDiscipline } from '../schedule/team-in-discipline.model';
import { Discipline } from '../discipline/discipline.model';
import { Division } from '../division/division.model';
import { Team } from '../team/team.model';
import { Media } from '../media/media.model';
import { Venue } from '../venue/venue.model';
import { CreatedBy, User } from '../user/user.model';
import { BelongsToClub, Club } from '../club/club.model';
import { Gymnast } from '../gymnast/gymnast.model';

/**
 *
 */
export interface TimeSpan {
  day: number;
  time: string;
}

/**
 * A Tournament describes a competitive event created and arranged by
 * a club, where the aim is for troops in the creators and other clubs
 * to compete against each other according to the rules specified by the NGTF.
 *
 * A Tournament must define which age and gender divisions it will allow, and
 * which disciplines troops can compete in.
 */
@Entity()
export class Tournament implements CreatedBy, BelongsToClub {
  @ApiModelProperty({ description: `The tournament primary key` })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty({ description: `The tournaments unique string identifier. Also the header everywhere tournament data is presented.` })
  @Column('varchar', { unique: true, length: 200 })
  name: string;

  @ApiModelPropertyOptional({ description: `Norwegian description in markdown` })
  @Column({ type: 'text', nullable: true })
  description_no?: string;

  @ApiModelPropertyOptional({ description: `English description in markdown` })
  @Column({ type: 'text', nullable: true })
  description_en?: string;

  @ApiModelProperty({ description: `The date for the first day of the event` })
  @Column('datetime')
  startDate: Date;

  @ApiModelProperty({ description: `The date for the last day of the event` })
  @Column('datetime')
  endDate: Date;

  @ApiModelPropertyOptional({ description: `An array of timespans, describing the start and end time for each day in the event.` })
  @Column({ type: 'json', nullable: true })
  times?: TimeSpan[];

  @ApiModelPropertyOptional({
    description: `This is the actual tournament schedule. It contains a list of
      teams in disciplines. If a team is competing in one discipline, it
      will only appear once in this list. If a team is competing in three
      disciplines, it will appear three times in this list.

      The list is sorted by order of appearence. First in list is first on the floor.` })
  @OneToMany(type => TeamInDiscipline, schedule => schedule.tournament)
  schedule?: TeamInDiscipline[];

  @ApiModelPropertyOptional({
    description: `Contains a list of disciplines available to compete in in this
      tournament. This allows the club arranging the event to limit
      clubs to enter in only certain disciplines.

      By default all known disciplines are enabled, but a club can actually
      also define custom disciplines if they want.` })
  @OneToMany(type => Discipline, disciplines => disciplines.tournament, { cascade: ['insert'] })
  disciplines?: Discipline[];

  @ApiModelPropertyOptional({
    description: `Contains a list of divisions (age and gender) available to compete
      in in this tournament. This allows the club arranging the event to
      limit clubs to enter only senior gymnasts for instance.` })
  @OneToMany(type => Division, divisions => divisions.tournament, { cascade: ['insert'] })
  divisions?: Division[];

  @ApiModelPropertyOptional({ description: `The list of teams registerred to compete in this tournament.` })
  @OneToMany(type => Team, teams => teams.tournament)
  teams?: Team[];

  @ApiModelPropertyOptional({ description: `The media registerred to be played in this tournament.` })
  @OneToMany(type => Media, media => media.tournament)
  media?: Media[];

  @ApiModelProperty({ description: `An object specifying the location of the event.` })
  @ManyToOne(type => Venue, venue => venue.tournaments, { lazy: true })
  @JoinColumn({ name: 'venueId' })
  venue: Venue;

  @Column('int')
  venueId: number;

  @ApiModelProperty({ description: `This field is automatically created when a user creates a newevent.` })
  @ManyToOne(type => User, user => user.tournaments, { nullable: false/*, lazy: true*/ })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column('int')
  createdById: number;

  @ApiModelProperty({ description: `A reference to the club this tournament is hosted by` })
  @ManyToOne(type => Club, club => club.tournaments, { nullable: true/*, lazy: true*/ })
  @JoinColumn({ name: 'clubId' })
  club: Club;

  @Column('int')
  clubId: number;

  // LODGING -----------------------------------------------------
  @ApiModelProperty({ description: `The number of gymnasts this tournament can be able to provide lodging for.` })
  @Column('tinyint', { default: true })
  providesLodging: boolean;

  @ApiModelPropertyOptional({
    description: `The price for lodging per head. This will be covered by
      the entry fee for the tournament, and split between all teams entering.` })
  @Column({ default: 0 })
  lodingCostPerHead?: number;

  @ApiModelPropertyOptional({ description: `The actual list of gymnasts signed up for lodging` })
  @ManyToMany(type => Gymnast, gymnasts => gymnasts.lodging)
  @JoinTable()
  lodging?: Gymnast[];

  // TRANSPORT ---------------------------------------------------
  @ApiModelProperty({ description: `If true, this tournament can provide transportation for traveling gymnasts.` })
  @Column('tinyint', { default: true })
  providesTransport: boolean;

  @ApiModelPropertyOptional({
    description: `The price for transportation per head. This will be covered by
      the entry fee for the tournament, and split between all teams entering.` })
  @Column({ default: 0 })
  transportationCostPerHead?: number;

  @ApiModelPropertyOptional({ description: `The list of gymnasts requiering transportation to the venue` })
  @ManyToMany(type => Gymnast, gymnasts => gymnasts.transport)
  @JoinTable()
  transport?: Gymnast[];

  // BANQUET -----------------------------------------------------
  @ApiModelProperty({ description: `If true, this tournament will throw a banquet in honor of the performing gymnasts.` })
  @Column('tinyint', { default: true })
  providesBanquet: boolean;

  @ApiModelPropertyOptional({
    description: `The price for the banquet per head. This will be covered by
      the entry fee for the tournament, and split between all teams entering.` })
  @Column({ default: 0 })
  banquetCostPerHead?: number;

  @ApiModelPropertyOptional({ description: `The list of gymnasts attending the banquet` })
  @ManyToMany(type => Gymnast, gymnasts => gymnasts.banquet)
  @JoinTable()
  banquet?: Gymnast[];
}
