import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToMany, JoinColumn } from 'typeorm';
import { Club, BelongsToClub } from './Club';
import { Tournament } from './Tournament';
import { Venue } from './Venue';

/**
 * A `Role` is a set privilege level in the system.
 * The higher the number, the more privileges a user has.
 *
 * @export
 * @enum Role
 */
export enum Role {
  Admin = 99, Organizer = 90, Secretariat = 80, Club = 50, User = 10
}

/**
 * The names of the roles exported in order to achieve
 * easier-to-read code.
 *
 * @export
 * @const RoleNames
 */
export const RoleNames = [
  {id: Role.Admin,       name: 'Admin'},
  {id: Role.Organizer,   name: 'Organizer'},
  {id: Role.Secretariat, name: 'Secretariat'},
  {id: Role.Club,        name: 'Club'},
  {id: Role.User,        name: 'User'}
];

/**
 * A Contract enforced on every object referencing user.
 * This ensures that we have a common reference property, and we
 * can easily identify User references by it.
 *
 * @export
 * @interface CreatedBy
 */
export interface CreatedBy {
  createdBy: User;
}


/**
 *
 * @export
 * @class User
 */
@Entity()
export class User implements BelongsToClub {
  /**
   *
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   *
   */
  @Column('varchar', { length: 100, unique: true })
  name: string;

  /**
   *
   */
  @Column('varchar', { length: 100, nullable: true })
  email: string;

  /**
   *
   */
  @Column('varchar', { length: 100 })
  password: string;

  /**
   *
   */
  @Column('int')
  role: Role;

  /**
   *
   */
  @ManyToOne(type => Club, club => club.users, { nullable: true })
  @JoinColumn({name: 'club'})
  club: Club;

  /**
   *
   */
  @OneToMany(type => Tournament, tournaments => tournaments.createdBy)
  tournaments: Tournament[];

  /**
   *
   */
  @OneToMany(type => Venue, venues => venues.createdBy)
  venues: Venue[];
}
