import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { TournamentParticipant } from './TournamentParticipant';
import { ScoreGroup } from './ScoreGroup';

/**
 * One score per participant and scoregroup.
 *
 * For each scoregroup a sum of all score values should be calculated.
 * For each participant a sum total of all score values from every scoregroup should be calculated.
 */
@Entity()
export class TournamentParticipantScore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: number;

  @ManyToOne(type => ScoreGroup, { cascadeRemove: true })
  group: ScoreGroup;

  @ManyToOne(type => TournamentParticipant, participant => participant.scores, { cascadeRemove: true })
  participant: TournamentParticipant;
}
