import { Entity, OneToMany } from 'typeorm';
import { JudgeInScoreGroup } from '../judge-in-score-group/judge-in-score-group.model';
import { Person } from '../person';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

/**
 * Defines one judge.
 */
@Entity()
export class Judge extends Person {
  @ApiModelPropertyOptional({ description: `A list of ScoreGroup's and (implicit through the scoregroup) Tournaments this judge has partaken` })
  @OneToMany(type => JudgeInScoreGroup, scoreGroup => scoreGroup.judge)
  scoreGroups?: JudgeInScoreGroup[];
}
