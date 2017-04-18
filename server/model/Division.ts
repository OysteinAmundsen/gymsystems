import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, ManyToOne, JoinTable, Index } from 'typeorm';

import { Tournament } from './Tournament';
import { Team } from './Team';

export enum DivisionType {
  Age = 1, Gender = 2
}
/**
 *
 */
@Entity()
@Index('division_tournament_name', (division: Division) => [division.name, division.tournament], { unique: true })
export class Division {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 0 })
  sortOrder?: number;

  @Column()
  type: DivisionType;

  @ManyToMany(type => Team, teams => teams.divisions)
  teams: Team[];

  @ManyToOne(type => Tournament, tournament => tournament.divisions, { nullable: false, cascadeRemove: true, onDelete: 'CASCADE' })
  tournament: Tournament;
}
