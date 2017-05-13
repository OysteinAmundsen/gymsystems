import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, Index, OneToMany } from 'typeorm';
import { Tournament } from './Tournament';
import { Discipline } from './Discipline';
import { Media } from './Media';
import { Division, DivisionType } from './Division';
import { Club, BelongsToClub } from './Club';

/**
 *
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

  @ManyToOne(type => Tournament, tournament => tournament.teams, { nullable: false, onDelete: 'CASCADE' })
  tournament: Tournament;

  @ManyToOne(type => Club, club => club.teams, { nullable: false, onDelete: 'CASCADE' })
  club: Club;

  @OneToMany(type => Media, media => media.team)
  media: Media[] = [];

  get divisionName(): string {
    const ageDivision = this.divisions.find(d => d.type === DivisionType.Age);
    const genderDivision = this.divisions.find(d => d.type === DivisionType.Gender);
    return `${genderDivision.name} ${ageDivision.name}`;
  }
}
