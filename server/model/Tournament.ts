import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Discipline } from './Discipline';
import { TournamentParticipant } from './TournamentParticipant';

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
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
  schedule?: TournamentParticipant[];

  @OneToMany(type => Discipline, disciplines => disciplines.tournament)
  disciplines?: Discipline[];
}
