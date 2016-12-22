import { Table, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { ScoreGroup } from './ScoreGroup';
import { Tournament } from './Tournament';
import { TournamentParticipantScore } from './TournamentParticipantScore';

/**
 * Defines a ScoreGroup type
 */
@Table()
export class TournamentScoreGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(type => ScoreGroup)
  @JoinColumn()
  scoreGroup: ScoreGroup;

  @OneToMany(type => TournamentParticipantScore, scores => scores.group)
  scores: TournamentParticipantScore[];

  @ManyToOne(type => Tournament, tournament => tournament.disciplines)
  tournament: Tournament;
}
