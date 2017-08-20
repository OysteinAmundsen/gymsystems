import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, Index, OneToMany } from 'typeorm';
import { Tournament } from './Tournament';
import { Discipline } from './Discipline';
import { Media } from './Media';
import { Division, DivisionType } from './Division';
import { Club, BelongsToClub } from './Club';
import { Gymnast } from './Gymnast';

export enum Classes {
  TeamGym = 1, National = 2
}
/**
 * A Team is a group of contestants in a club belonging to
 * the same type of age division.
 *
 * @export
 * @class Team
 */
@Entity()
@Index('team_name_tournament', (team: Team) => [team.name, team.tournament], { unique: true})
export class Team implements BelongsToClub {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @ManyToMany(type => Division, division => division.teams)
  @JoinTable()
  divisions: Division[] = [];

  @ManyToMany(type => Discipline, discipline => discipline.teams, { cascadeInsert: false, cascadeUpdate: false })
  @JoinTable()
  disciplines: Discipline[] = [];

  @ManyToMany(type => Gymnast, gymnasts => gymnasts.team, { cascadeInsert: false, cascadeUpdate: false })
  gymnasts: Gymnast[];

  @ManyToOne(type => Tournament, tournament => tournament.teams, { nullable: false })
  tournament: Tournament;

  @ManyToOne(type => Club, club => club.teams, { nullable: false })
  club: Club;

  @OneToMany(type => Media, media => media.team, { cascadeInsert: false, cascadeUpdate: false })
  media: Media[] = [];

  @Column({ default: Classes.National })
  class: Classes;

  get divisionName(): string {
    const ageDivision = this.divisions.find(d => d.type === DivisionType.Age);
    const genderDivision = this.divisions.find(d => d.type === DivisionType.Gender);
    return `${genderDivision.name} ${ageDivision.name}`;
  }
}
