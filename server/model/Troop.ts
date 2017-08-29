import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, Index, OneToMany } from 'typeorm';
import { Tournament } from './Tournament';
import { Discipline } from './Discipline';
import { Media } from './Media';
import { Division, DivisionType } from './Division';
import { Club, BelongsToClub } from './Club';
import { Gymnast } from './Gymnast';

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
 *
 * @export
 * @class Troop
 */
@Entity()
export class Troop implements BelongsToClub {
  /**
   * The Troop/Team primary key
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * A unique name for this troop.
   * The name is inherited from the `Troop` which originally defined
   * the team layout, but it can be changed.
   */
  @Column({ length: 100 })
  name: string;

  /**
   * A list of gymnasts present in this troop. This is also stamped
   * out from the initial `Troop` setup, but can be changed by the
   * club at will in order to finetune the team for this event.
   */
  @ManyToMany(type => Gymnast, gymnasts => gymnasts.troop, { cascadeInsert: false, cascadeUpdate: false })
  gymnasts: Gymnast[];

  /**
   * The `Club` which created and is responsible for this troop.
   */
  @ManyToOne(type => Club, club => club.teams, { nullable: false })
  club: Club;

  /**
   * The media uploaded by this team. This is by default references to
   * media from the `Troop` object, so one troop can have a default 'theme',
   * but this can also be changed by the club for a given tournament.
   *
   * Media is presented as an array of files, one per discipline.
   */
  @OneToMany(type => Media, media => media.team, { cascadeInsert: false, cascadeUpdate: false })
  media: Media[] = [];
}
