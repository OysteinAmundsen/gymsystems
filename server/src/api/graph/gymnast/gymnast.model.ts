import { Entity, Column, ManyToOne, ManyToMany, JoinTable, Index, JoinColumn } from 'typeorm';
import { BelongsToClub, Club } from '../club/club.model';
import { Person } from '../person';
import { Troop } from '../troop/troop.model';
import { Team } from '../team/team.model';
import { Tournament } from '../tournament/tournament.model';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

/**
 * Defines the available genders
 */
export enum Gender {
  Male = 1,
  Female = 2
}

/**
 * Defines one performer in a troop/team.
 * Clubs are encouraged to enter all performers registerred
 * to their club. At least the ones performing in competitive
 * events. This will allow the clubs to get calculated statistics
 * over time.
 */
@Entity()
@Index('gymnast_club_name', (gymnast: Gymnast) => [gymnast.name, gymnast.club], { unique: true })
export class Gymnast extends Person implements BelongsToClub {
  @ApiModelProperty({
    description: `The birth year of the performer will allow the system to automatically calculate which
      Age Division this performer can be entered in.

      This opens for automatic troop/team generation.` })
  @Column('int')
  birthYear: number;

  @ApiModelProperty({ description: `Will replace the birthYear property in the near future` })
  @Column('datetime', { nullable: true })
  birthDate?: Date;

  @ApiModelProperty({
    description: `The gender of the performer will allow the system to automatically calculate which Gender divisions
      this performer can be entered in.

      This opens for automatic troop/team generation`, enum: Gender
  })
  @Column('int')
  gender: Gender;

  @ApiModelPropertyOptional({ description: `Name of a parent or a legal guardian for this gymnast` })
  @Column('varchar', { nullable: true })
  guardian1?: string;

  @ApiModelPropertyOptional({ description: `Phone number of a parent or a legal guardian for this gymnast` })
  @Column('varchar', { nullable: true })
  guardian1Phone?: string;

  @ApiModelPropertyOptional({ description: `Email address of a parent or a legal guardian for this gymnast` })
  @Column('varchar', { nullable: true })
  guardian1Email?: string;

  @ApiModelPropertyOptional({ description: `Name of a parent or a legal guardian for this gymnast` })
  @Column('varchar', { nullable: true })
  guardian2?: string;

  @ApiModelPropertyOptional({ description: `Phone number of a parent or a legal guardian for this gymnast` })
  @Column('varchar', { nullable: true })
  guardian2Phone?: string;

  @ApiModelPropertyOptional({ description: `Email address of a parent or a legal guardian for this gymnast` })
  @Column('varchar', { nullable: true })
  guardian2Email?: string;

  @ApiModelProperty({ description: `A reference to the club this perfomer is registerred under` })
  @ManyToOne(type => Club, club => club.gymnasts, { nullable: false/*, lazy: true*/ })
  @JoinColumn({ name: 'clubId' })
  club: Club;

  @Column('int')
  clubId: number;

  @ApiModelPropertyOptional({ description: `A reference to troops this perfomer is a part of` })
  @ManyToMany(type => Troop, troop => troop.gymnasts)
  @JoinTable({ name: 'gymnast_troop_troop_id' })
  troop?: Troop[];

  @ApiModelPropertyOptional({ description: `A reference to teams this perfomer is/has been a part of` })
  @ManyToMany(type => Team, team => team.gymnasts)
  @JoinTable({ name: 'gymnast_team_team_id' })
  team?: Team[];

  @ApiModelPropertyOptional({ description: `A list of tournaments this gymnast has applied lodging for` })
  @ManyToMany(type => Tournament, tournament => tournament.lodging)
  lodging?: Tournament[];

  @ApiModelPropertyOptional({ description: `A list of tournaments this gymnast has applied transport for` })
  @ManyToMany(type => Tournament, tournament => tournament.transport)
  transport?: Tournament[];

  @ApiModelPropertyOptional({ description: `A list of tournaments this gymnast has attended banquets for` })
  @ManyToMany(type => Tournament, tournament => tournament.banquet)
  banquet?: Tournament[];
}
