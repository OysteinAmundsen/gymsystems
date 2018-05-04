import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Index, OneToMany } from 'typeorm';
import { Tournament } from './Tournament';
import { Discipline } from './Discipline';
import { Division } from './Division';
import { Team } from './Team';
import { User } from './User';
import { Gymnast } from './Gymnast';
import { Troop } from './Troop';


/**
 * A contract bound to every object referencing a `Club` object
 * This ensures that we have a common reference property, and we
 * can easily identify Club references by it.
 *
 * @export
 * @interface BelongsToClub
 */
export interface BelongsToClub {
  club: Club;
}

/**
 * Defines one club. A Club is a named entity holding one or
 * more teams which can be entered into competitive events.
 *
 * A club is usually present in a registry like 'Brønnøysund registeret'
 * which
 *
 * @export
 * @class Club
 */
@Entity()
export class Club {
  /**
   * The Club primary key
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * A unique name for the club. This will take suggestions from
   * http://www.brreg.no, but can be customized if needed. We do
   * however recommend that the name returned from Brønnøysund is
   * kept, as we might fetch more information from this registry in
   * the future, in order to present users with more details about
   * your club.
   */
  @Column('varchar', { unique: true, length: 100 })
  name: string;

  /**
   * A list of troops configured for this club.
   */
  @OneToMany(type => Troop, troops => troops.club)
  troops: Troop[];

  /**
   * A list of teams registerred to this club. This will also
   * indirectly give information about which tournaments this club
   * has partaken in, as the team is bound to one tournament.
   */
  @OneToMany(type => Team, teams => teams.club)
  teams: Team[];

  /**
   * A list of tournaments this club has created.
   */
  @OneToMany(type => Tournament, tournaments => tournaments.club)
  tournaments: Tournament[];

  /**
   * A list of users associated with this club. Users are usually
   * only entities with logins to the system and must not be confused
   * with other personal entities like `Gymnast`, which does not
   * actually need to be a `User` in the system.
   */
  @OneToMany(type => User, users => users.club)
  users: User[];

  /**
   * A list of `Gymnasts` associated with this club.
   *
   * Gymnasts are the performers in the club, and are divided into
   * troops, which in turn are inherited to `Team`s during events.
   *
   * Not all gymnasts are qualified to end up in a troop or team,
   * but all gymnasts training under the club must be present here.
   */
  @OneToMany(type => Gymnast, gymnasts => gymnasts.club)
  gymnasts: Gymnast[];
}
