import { Table, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Tournament } from './Tournament';
import { Team } from './Team';
import { TournamentDiscipline } from './TournamentDiscipline';
import { TournamentParticipantScore } from './TournamentParticipantScore';

@Table()
export class TournamentParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startTime: Date;

  @Column()
  startNumber: number;

  @OneToOne(type => TournamentDiscipline)
  @JoinColumn()
  discipline: TournamentDiscipline;

  @OneToOne(type => Team)
  @JoinColumn()
  team: Team;

  @ManyToOne(type => Tournament, tournament => tournament.schedule)
  tournament: Tournament;

  @OneToMany(type => TournamentParticipantScore, score => score.participant)
  scores: TournamentParticipantScore[];
}
