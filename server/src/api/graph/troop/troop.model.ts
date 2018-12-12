import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinColumn } from 'typeorm';
import { BelongsToClub, Club } from '../club/club.model';
import { Gymnast } from '../gymnast/gymnast.model';
import { ApiModelProperty } from '@nestjs/swagger';


/**
 * A `Troop` is a standard composition of gymnasts for a club.
 * The troop is inderectly entered into tournaments by using
 * a `Team` proxy. At the time a club enteres a tournament, the
 * current `Troop` configuration is stamped out into `Team` objects
 * which is then bound to the tournament. Any changes to the `Troop`
 * setup will affect next tournament entry only.
 *
 * This is done to allow clubs the freedom to modify gymnast composition
 * for each tournament freely, and still allow easier entry through
 * pre-configured teams.
 *
 * You should therefore consider the `Troop` object to be a blueprint
 * of a `Team`.
 *
 * - A troop must contain a minimum of 6 gymnasts.
 * - A troop must contain gymnasts of the same age division
 */
@Entity()
export class Troop implements BelongsToClub {
  @ApiModelProperty({ description: `The Troop primary key` })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty({ description: `A unique name for this troop.` })
  @Column('varchar', { length: 100 })
  name: string;

  @ApiModelProperty({ description: `The 'Club' which created and is responsible for this troop.` })
  @ManyToOne(type => Club, club => club.troops, { nullable: false/*, lazy: true*/ })
  @JoinColumn({ name: 'clubId' })
  club: Club;

  @Column('int')
  clubId: number;

  @ApiModelProperty({ description: `A list of gymnasts present in this troop.` })
  @ManyToMany(type => Gymnast, gymnasts => gymnasts.troop)
  gymnasts?: Gymnast[];
}
