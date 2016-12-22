import {Table, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne} from 'typeorm';
import {TournamentParticipant} from './TournamentParticipant';
import { TournamentScoreGroup } from './TournamentScoreGroup';

/**
 * One score per participant and scoregroup.
 *
 * For each scoregroup a sum of all score values should be calculated.
 * For each participant a sum total of all score values from every scoregroup should be calculated.
 */
@Table()
export class TournamentParticipantScore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: number;

  @ManyToOne(type => TournamentScoreGroup)
  group: TournamentScoreGroup;

  @ManyToOne(type => TournamentParticipant, participant => participant.scores)
  participant: TournamentParticipant;
}
