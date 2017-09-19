import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, Index, OneToMany, JoinColumn } from 'typeorm';
import { Tournament } from './Tournament';
import { Discipline } from './Discipline';
import { Media } from './Media';
import { Division, DivisionType } from './Division';
import { Club, BelongsToClub } from './Club';
import { Gymnast } from './Gymnast';
import { Troop } from './Troop';

/**
 * A team can compete in either `National classes` (which is singular
 * disciplines), or in what is known as `TeamGym` (which is all
 * disciplines combined).
 *
 * The latter is bound to a more advanced set of scoring rules, where
 * the total is calculated from the average score of all disciplines.
 *
 * @export
 * @enum Classes
 */
export enum Classes {
  TeamGym = 1, National = 2
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
 *
 * @export
 * @class Team
 */
@Entity()
@Index('team_name_tournament', (team: Team) => [team.name, team.tournament], { unique: true})
export class Team implements BelongsToClub {

  /**
   * The Troop/Team primary key
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * A unique name for this team.
   * The name is inherited from the `Troop` which originally defined
   * the team layout, but it can be changed.
   */
  @Column({ length: 100 })
  name: string;

  /**
   * The team must be competing in either 'National classes' or 'Teamgym'.
   * Default is 'National classes'
   */
  @Column({ default: Classes.National })
  class: Classes;

  /**
   * The divisions this team is to compete in. This can only be an array
   * in the following format: `[ GenderDivision, AgeDivision ]`
   */
  @ManyToMany(type => Division, division => division.teams)
  @JoinTable({name: 'team_divisions_division_id'})
  divisions: Division[] = [];

  /**
   * A list of gymnasts present in this team. This is also stamped
   * out from the initial `Troop` setup, but can be changed by the
   * club at will in order to finetune the team for this event.
   */
  @ManyToMany(type => Gymnast, gymnasts => gymnasts.team, { cascadeInsert: false, cascadeUpdate: false })
  gymnasts: Gymnast[];

  /**
   * The `Club` which created and is responsible for this troop.
   */
  @ManyToOne(type => Club, club => club.teams, { nullable: false })
  @JoinColumn({name: 'club'})
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

  /**
   * The disciplines this team is to compete in in this tournament
   */
  @ManyToMany(type => Discipline, discipline => discipline.teams, { cascadeInsert: false, cascadeUpdate: false })
  @JoinTable({name: 'team_disciplines_discipline_id'})
  disciplines: Discipline[] = [];

  /**
   * The tournament this team is to compete in.
   */
  @ManyToOne(type => Tournament, tournament => tournament.teams, { nullable: false })
  @JoinColumn({name: 'tournament'})
  tournament: Tournament;

  /**
   * Convenience method for displaying the division array as
   * '{GenderDivision} {AgeDivision}'
   */
  get divisionName(): string {
    const ageDivision = this.divisions.find(d => d.type === DivisionType.Age);
    const genderDivision = this.divisions.find(d => d.type === DivisionType.Gender);
    return `${genderDivision.name} ${ageDivision.name}`;
  }
}
