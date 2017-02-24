import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, ManyToOne, JoinTable } from 'typeorm';

import { Tournament } from './Tournament';
import { Team } from './Team';

export enum DivisionType {
  Age = 1, Gender = 2
}
/**
 *
 */
@Entity()
export class Division {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: DivisionType;

  @ManyToMany(type => Team, teams => teams.divisions, { cascadeInsert: false, cascadeUpdate: false })
  teams: Team[];

  @ManyToOne(type => Tournament, tournament => tournament.divisions, { nullable: false, cascadeRemove: true, onDelete: 'CASCADE' })
  tournament: Tournament;
}
