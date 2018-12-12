import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { CreatedBy, User } from '../user/user.model';
import { Tournament } from '../tournament/tournament.model';
import { ApiModelProperty } from '@nestjs/swagger';


/**
 *
 */
@Entity()
export class Venue implements CreatedBy {
  @ApiModelProperty({ description: `` })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty({ description: `` })
  @Column('varchar', { length: 100, unique: true })
  name: string;

  @ApiModelProperty({ description: `` })
  @Column('varchar', { length: 200 })
  address: string;

  @ApiModelProperty({ description: `` })
  @Column('varchar')
  longitude?: string;

  @ApiModelProperty({ description: `` })
  @Column('varchar')
  latitude?: string;

  @ApiModelProperty({ description: `` })
  @Column('int')
  rentalCost?: number;

  @ApiModelProperty({ description: `` })
  @Column('varchar', { length: 200 })
  contact?: string;

  @ApiModelProperty({ description: `` })
  @Column('int')
  contactPhone?: string;

  @ApiModelProperty({ description: `` })
  @Column('varchar', { length: 100 })
  contactEmail?: string;

  @ApiModelProperty({ description: `` })
  @Column('int')
  capacity?: number;

  @ApiModelProperty({ description: `The user which has established contact with this venue` })
  @ManyToOne(type => User, user => user.venues, { nullable: false/*, lazy: true*/ })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column('int')
  createdById: number;

  @ApiModelProperty({ description: `A list of tournaments hosted at this venue` })
  @OneToMany(type => Tournament, tournaments => tournaments.venue)
  tournaments?: Tournament[];
}
