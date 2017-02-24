import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Tournament } from './Tournament';
import { Discipline } from './Discipline';
import { Division } from './Division';

/**
 *
 *
 * @export
 * @class Team
 */
@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @ManyToMany(type => Division, division => division.teams, { cascadeInsert: true, cascadeUpdate: true })
  @JoinTable()
  divisions: Division[] = [];

  @ManyToMany(type => Discipline, discipline => discipline.teams, { cascadeInsert: true, cascadeUpdate: true })
  @JoinTable()
  disciplines: Discipline[] = [];

  @ManyToOne(type => Tournament, tournament => tournament.teams, { nullable: false, cascadeRemove: true, onDelete: 'CASCADE' })
  tournament: Tournament;
}
