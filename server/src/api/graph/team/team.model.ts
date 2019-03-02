import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, Index, OneToMany, JoinColumn } from 'typeorm';
import { Gymnast } from '../gymnast/gymnast.model';
import { Club, BelongsToClub } from '../club/club.model';
import { Media } from '../media/media.model';
import { Discipline } from '../discipline/discipline.model';
import { Tournament } from '../tournament/tournament.model';
import { Division, DivisionType } from '../division/division.model';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';


/**
 * A team can compete in either `National classes` (which is singular
 * disciplines), or in what is known as `TeamGym` (which is all
 * disciplines combined).
 *
 * The latter is bound to a more advanced set of scoring rules, where
 * the total is calculated from the average score of all disciplines.
 */
export enum Classes {
  TeamGym = 1,
  National = 2
}

/**
 * A `Team` is a snapshot of the current `Troop` setup for a club, when
 * a club is entered into a tournament. Although it contains many of the same
 * values as `Troop`, it belongs to one tournament and is only used in that
 * tournament. Thus a club can modify gymnast compositions for each tournament,
 * and still keep a master setup in their `Troop` configuration.
 *
 * - A team must contain a minimum of 6 gymnasts.
 * - A team must contain gymnasts of the same age division
 */
@Entity()
@Index('team_name_tournament', (team: Team) => [team.name, team.tournament], { unique: true })
export class Team implements BelongsToClub {
  @ApiModelProperty({ description: `The Team primary key` })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty({
    description: `A unique name for this team.
      The name is inherited from the 'Troop' which originally defined
      the team layout, but it can be changed.` })
  @Column('varchar', { length: 100 })
  name: string;

  @ApiModelProperty({ description: `The team must be competing in either 'National classes' or 'Teamgym'.`, default: Classes.National })
  @Column('int', { default: Classes.National })
  class: Classes;

  @ApiModelProperty({ description: `The 'Club' which created and is responsible for this troop.` })
  @ManyToOne(type => Club, club => club.teams, { nullable: false/*, lazy: true*/ })
  @JoinColumn({ name: 'clubId' })
  club: Club;

  @Column('int')
  clubId: number;

  @ApiModelProperty({ description: `The tournament this team is to compete in.` })
  @ManyToOne(type => Tournament, tournament => tournament.teams, { nullable: false/*, lazy: true*/ })
  @JoinColumn({ name: 'tournamentId' })
  tournament: Tournament;

  @Column('int')
  tournamentId: number;

  @ApiModelPropertyOptional({
    description: `A list of gymnasts present in this team. This is also stamped
      out from the initial 'Troop' setup, but can be changed by the
      club at will in order to finetune the team for this event.` })
  @ManyToMany(type => Gymnast, gymnasts => gymnasts.team)
  gymnasts?: Gymnast[];

  @ApiModelPropertyOptional({
    description: `The media uploaded by this team. This is by default references to
      media from the 'Troop' object, so one troop can have a default 'theme',
      but this can also be changed by the club for a given tournament.

      Media is presented as an array of files, one per discipline.` })
  @OneToMany(type => Media, media => media.team)
  media?: Media[];

  @ApiModelPropertyOptional({ description: `The disciplines this team is to compete in in this tournament` })
  @ManyToMany(type => Discipline, discipline => discipline.teams)
  @JoinTable({ name: 'team_disciplines_discipline_id' })
  disciplines?: Discipline[];

  @ApiModelPropertyOptional({
    description: `The divisions this team is to compete in.
      This can only be an array in the following format: '[ GenderDivision, AgeDivision ]'` })
  @ManyToMany(type => Division, division => division.teams)
  @JoinTable({ name: 'team_divisions_division_id' })
  divisions?: Division[];
}
