import { PrimaryGeneratedColumn, Column, Entity, OneToMany, ManyToOne } from 'typeorm';

import { Tournament } from './Tournament';
import { Team } from './Team';

/**
 *
 */
@Entity()
export class Division {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => Team, teams => teams.division)
  teams: Team[] = [];

  @ManyToOne(type => Tournament, tournament => tournament.divisions, { nullable: false, cascadeRemove: true, onDelete: 'CASCADE' })
  tournament: Tournament;
}
