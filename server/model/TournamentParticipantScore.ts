import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
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

  @UpdateDateColumn({ nullable: true})
  updated?: Date;

  @ManyToOne(type => ScoreGroup, { nullable: false, cascadeRemove: false, onDelete: 'CASCADE' })
  scoreGroup: ScoreGroup;

  @Column({ nullable: true })
  judgeIndex: number;

  @ManyToOne(type => TournamentParticipant, participant => participant.scores, {
    nullable: false, cascadeInsert: false, cascadeUpdate: false, cascadeRemove: false, onDelete: 'CASCADE'
  })
  participant: TournamentParticipant;
}

