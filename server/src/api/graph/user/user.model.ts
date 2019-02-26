import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BelongsToClub, Club } from '../club/club.model';
import { Tournament } from '../tournament/tournament.model';
import { Venue } from '../venue/venue.model';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';


/**
 * A `Role` is a set privilege level in the system.
 * The higher the number, the more privileges a user has.
 */
export enum Role {
  Admin = 99,
  Organizer = 90,
  Secretariat = 80,
  Club = 50,
  User = 10
}

/**
 * The names of the roles exported in order to achieve
 * easier-to-read code.
 */
export const RoleNames = [
  { id: Role.Admin, name: 'Admin' },
  { id: Role.Organizer, name: 'Organizer' },
  { id: Role.Secretariat, name: 'Secretariat' },
  { id: Role.Club, name: 'Club' },
  { id: Role.User, name: 'User' }
];

/**
 * A Contract enforced on every object referencing user.
 * This ensures that we have a common reference property, and we
 * can easily identify User references by it.
 */
export interface CreatedBy {
  createdBy: User;
}

/**
 *
 */
@Entity()
export class User implements BelongsToClub {
  @ApiModelProperty({ description: 'The Users primary key' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty({ description: 'The Users full name' })
  @Column('varchar', { length: 100, unique: true })
  name: string;

  @ApiModelProperty({ description: 'The Users email address' })
  @Column('varchar', { length: 100, nullable: true })
  email?: string;

  @Exclude()
  @ApiModelPropertyOptional({ description: 'The Users encrypted password' })
  @Column('varchar', { length: 100 })
  password: string;

  @ApiModelProperty({ description: 'An integer categorizing this users authorization level in the system', enum: Role })
  @Column('int')
  role: Role;

  @ApiModelPropertyOptional({ description: 'A List of tournaments this user has created and is organizer for' })
  @OneToMany(type => Tournament, tournaments => tournaments.createdBy)
  tournaments?: Tournament[];

  @ApiModelPropertyOptional({ description: 'A list of venues this user has established contact with' })
  @OneToMany(type => Venue, venues => venues.createdBy)
  venues?: Venue[];

  @ApiModelProperty({ description: 'The club this user belongs to' })
  @ManyToOne(type => Club, club => club.users, { nullable: true/*, lazy: true*/ })
  @JoinColumn({ name: 'clubId' })
  club?: Club;

  @Column('int', { nullable: true })
  clubId: number;

  @ApiModelProperty({ description: 'The activation status of this user. Any user registerred needs to be confirmed by a club representative before being activated.' })
  @Column('boolean', { default: false })
  activated: boolean
}
