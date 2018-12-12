import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';

import { ScoreGroup } from '../score-group/score-group.model';
import { TeamInDiscipline } from '../schedule/team-in-discipline.model';


/**
 * One score per participant and scoregroup.
 *
 * For each `Scoregroup` a sum of all score values should be calculated.
 * For each `Team` a sum total of all score values from every scoregroup should be calculated.
 */
@Entity()
export class Score {
  @ApiModelProperty({ description: `The scores primary key` })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty({
    description: `The actual score. The score must be greater than 0, and less than
      the configured maximum score value this tournament defines.
      Values can be decimals, but must be rounded upwards to the nearest 0.05` })
  @Column('float')
  value: number;

  @ApiModelProperty({ description: `Specifies the timestamp this score is created/updated` })
  @UpdateDateColumn({ nullable: true })
  updated: Date;

  @ApiModelProperty({
    description: `Together with the 'ScoreGroup', this identifies the judge
      that gave the score.

      For instance for ScoreGroup 'E' and judgeIndex 1, this score
      is delivered from judge E1 - which is the master judge for Execution.` })
  @Column('int', { nullable: true })
  judgeIndex?: number;

  @ApiModelProperty({ description: `The 'ScoreGroup' this score affects.` })
  @ManyToOne(type => ScoreGroup, { nullable: false/*, lazy: true*/ })
  @JoinColumn({ name: 'scoreGroupId' })
  scoreGroup: ScoreGroup;

  @Column('int')
  scoreGroupId: number;

  @ApiModelProperty({ description: `The reference back to the schedule. This identifies the 'Team' in the given discipline.` })
  @ManyToOne(type => TeamInDiscipline, participant => participant.scores, { nullable: false/*, lazy: true*/ })
  @JoinColumn({ name: 'participantId' })
  participant: TeamInDiscipline;

  @Column('int')
  participantId: number;
}
