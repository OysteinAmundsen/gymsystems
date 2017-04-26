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
  startNumber: number;

  @Column({ nullable: true })
  startTime: Date;

  @Column({ nullable: true })
  endTime: Date;

  @Column({ nullable: true })
  publishTime: Date;

  @ManyToOne(type => Tournament, tournament => tournament.schedule, { nullable: false })
  tournament: Tournament;

  @OneToOne(type => Discipline, { nullable: false })
  @JoinColumn()
  discipline: Discipline;

  @OneToOne(type => Team, { nullable: false })
  @JoinColumn()
  team: Team;

  @OneToMany(type => TournamentParticipantScore, score => score.participant, { cascadeInsert: true, cascadeUpdate: true })
  scores: TournamentParticipantScore[];
}
