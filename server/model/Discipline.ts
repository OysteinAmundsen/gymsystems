import { ScoreGroup } from './ScoreGroup';
import { Tournament } from './Tournament';
import { Team } from './Team';
import { PrimaryGeneratedColumn, Column, Entity, OneToMany, ManyToOne, ManyToMany, JoinTable } from 'typeorm';

/**
 * Describes the available disciplines in this sport.
 */
@Entity()
export class Discipline {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(type => Team, team => team.disciplines)
  @JoinTable()
  teams: Team[] = [];

  @ManyToOne(type => Tournament, tournament => tournament.disciplines, { nullable: false, cascadeRemove: true, onDelete: 'CASCADE' })
  tournament: Tournament;

  @OneToMany(type => ScoreGroup, scoreGroup => scoreGroup.discipline)
  scoreGroups: ScoreGroup[] = [];
}
