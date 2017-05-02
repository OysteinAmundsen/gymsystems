import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { Discipline } from './Discipline';
import { Division } from './Division';
import { Team } from './Team';
import { TournamentParticipant } from './TournamentParticipant';

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  location: string;

  @OneToMany(type => TournamentParticipant, schedule => schedule.tournament)
  schedule: TournamentParticipant[];

  @OneToMany(type => Discipline, disciplines => disciplines.tournament, { cascadeInsert: true })
  disciplines: Discipline[];

  @OneToMany(type => Division, divisions => divisions.tournament, { cascadeInsert: true })
  divisions: Division[];

  @OneToMany(type => Team, teams => teams.tournament)
  teams: Team[];
}
