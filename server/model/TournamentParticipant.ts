import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Tournament } from './Tournament';
import { Team } from './Team';
import { Discipline } from './Discipline';
import { TournamentParticipantScore } from './TournamentParticipantScore';

/**
 * Marks one entry in the tournaments schedule
 *
 * @export
 * @class TournamentParticipant
 */
@Entity()
export class TournamentParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startTime: Date;

  @Column()
  startNumber: number;

  @ManyToOne(type => Tournament, tournament => tournament.schedule, { cascadeRemove: true })
  tournament: Tournament;

  @OneToOne(type => Discipline)
  @JoinColumn()
  discipline: Discipline;

  @OneToOne(type => Team)
  @JoinColumn()
  team: Team;

  @OneToMany(type => TournamentParticipantScore, score => score.participant)
  scores: TournamentParticipantScore[];
}
