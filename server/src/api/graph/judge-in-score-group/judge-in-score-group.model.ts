import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { ScoreGroup } from '../score-group/score-group.model';
import { Judge } from '../judge/judge.model';
import { ApiModelProperty } from '@nestjs/swagger';


/**
 * Resolves many-to-many relation between `Judge` and `ScoreGroup`.
 * This is done in order to save the ordering of judges within the scoregroup.
 */
@Entity()
export class JudgeInScoreGroup {
  @Column('int')
  sortNumber: number;

  @ApiModelProperty({ description: `` })
  @ManyToOne(type => ScoreGroup, { nullable: false, primary: true/*, lazy: true*/ })
  @JoinColumn({ name: 'scoreGroupId' })
  scoreGroup: ScoreGroup;

  @PrimaryColumn('int')
  scoreGroupId: number;

  @ApiModelProperty({ description: `` })
  @ManyToOne(type => Judge, { nullable: false, primary: true/*, lazy: true*/ })
  @JoinColumn({ name: 'judgeId' })
  judge: Judge;

  @PrimaryColumn('int')
  judgeId: number;

}
