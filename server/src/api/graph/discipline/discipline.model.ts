import { PrimaryGeneratedColumn, Column, Entity, OneToMany, ManyToOne, ManyToMany, JoinColumn } from 'typeorm';
import { Team } from '../team/team.model';
import { Tournament } from '../tournament/tournament.model';
import { ScoreGroup } from '../score-group/score-group.model';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';


/**
 * Describes the available disciplines in this tournament.
 */
@Entity()
export class Discipline {
  @ApiModelProperty({ description: 'The Discipline primary key' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty({ description: 'A descriptive name for this discipline' })
  @Column('varchar')
  name: string;

  @ApiModelProperty({ description: 'A numeric representation of how this object should be sorted' })
  @Column('int', { default: 0 })
  sortOrder: number;

  @ApiModelProperty({ description: 'The tournament where this discipline is to be competed in' })
  @ManyToOne(type => Tournament, tournament => tournament.disciplines, { nullable: false/*, lazy: true*/ })
  @JoinColumn({ name: 'tournamentId' })
  tournament: Tournament;

  @Column('int')
  tournamentId: number;

  @ApiModelPropertyOptional({ description: 'A reference to the teams competing in this discipline' })
  @ManyToMany(type => Team, team => team.disciplines)
  teams?: Team[];

  @ApiModelPropertyOptional({ description: 'The scoregroup configuration for this discipline' })
  @OneToMany(type => ScoreGroup, scoreGroup => scoreGroup.discipline)
  scoreGroups?: ScoreGroup[];
}
