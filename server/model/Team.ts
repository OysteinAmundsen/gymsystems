import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, Index } from 'typeorm';
import { Tournament } from './Tournament';
import { Discipline } from './Discipline';
import { Division } from './Division';
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
}
