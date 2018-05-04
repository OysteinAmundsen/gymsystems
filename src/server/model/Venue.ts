import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Tournament } from './Tournament';
import { CreatedBy, User } from './User';

/**
 * A `Venue` is a location made ready for holding events
 *
 * @export
 * @class Venue
 */
@Entity()
export class Venue implements CreatedBy {
  /**
   * The user responsible for the information about this venue
   */
  @ManyToOne(type => User, user => user.venues, {nullable: false})
  @JoinColumn({name: 'createdBy'})
  createdBy: User;

  /**
   * The Venue primary key
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * A unique name for this venue.
   */
  @Column('varchar', { length: 100, unique: true })
  name: string;

  /**
   * The longitude part of the geolocation for this venue
   */
  @Column('varchar')
  longitude: string;

  /**
   * The latitude part of the geolocation for this venue
   */
  @Column('varchar')
  latitude: string;

  /**
   * A human readable address for this venue
   */
  @Column('varchar', { length: 200 })
  address: string;

  /**
   * The cost of renting this venue
   */
  @Column('int')
  rentalCost: number;

  /**
   * A named contact person registerred as owner of this venue
   */
  @Column('varchar', { length: 200 })
  contact: string;

  /**
   * A phone number for the contact person registerred as owner of this venue
   */
  @Column('int')
  contactPhone: number;

  /**
   * An email address for the contact person registerred as owner of this venue
   */
  @Column('varchar', { length: 100 })
  contactEmail: string;

  /**
   * The audience capacity this venue rooms
   */
  @Column('int')
  capacity: number;

  /**
   * The tournaments registered to be held at this venue
   */
  @OneToMany(type => Tournament, tournaments => tournaments.venue)
  tournaments: Tournament[];
}
