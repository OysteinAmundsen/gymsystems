import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, OneToMany} from 'typeorm';
import { Discipline } from './Discipline';
import { Tournament } from './Tournament';

@Entity()
export class TournamentDiscipline {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(type => Discipline)
  @JoinColumn()
  discipline: Discipline;

  @ManyToOne(type => Tournament, tournament => tournament.disciplines)
  tournament: Tournament;
}
