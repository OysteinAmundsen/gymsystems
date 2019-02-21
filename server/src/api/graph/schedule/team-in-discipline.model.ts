import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Division } from '../division/division.model';
import { Team } from '../team/team.model';
import { Score } from '../score/score.model';
import { Discipline } from '../discipline/discipline.model';
import { Tournament } from '../tournament/tournament.model';
import { Media } from '../media/media.model';


/**
 * Defines if this entry should be a part of the competitive
 * event, or if this entry is non-score giving training entry
 * happening pre-event.
 */
export enum ParticipationType {
  Training = 1,
  Live = 2
}

/**
 * Marks one entry in the tournaments schedule
 */
@Entity()
@Index('tournament_team_discipline', (participant: TeamInDiscipline) => [participant.tournamentId, participant.teamId, participant.disciplineId], { unique: true })
export class TeamInDiscipline {
  @ApiModelProperty({ description: `The primary key` })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty({ description: `Where in the schedule this placed. This defines the execution sequence` })
  @Column('int')
  sortNumber: number;

  @ApiModelProperty({
    description: `When planning a tournament, this number is usually equal to the sortNumber,
      but we can have last minute changes which will not change the actual
      startNumber, but will change the sortNumber.` })
  @Column('int')
  startNumber: number;

  @ApiModelProperty({
    description: `When planning a tournament, we can perform an actual deletion of records here,
      but we cannot remove participants on the day of the tournament. If any teams
      cannot perform for any reason, we mark them as stricken.` })
  @Column('tinyint', { default: false })
  markDeleted: boolean;

  @ApiModelPropertyOptional({
    description: `If this is null, we estimate start time based on previous sortNumber.
      If this is not null, this participant has started it's execution.` })
  @Column('datetime', { nullable: true })
  startTime?: Date;

  @ApiModelPropertyOptional({
    description: `If this is null, the participant has either not yet started it's execution,
      or is in the middle of executing its performance.
      If this is not null, the participant is done.` })
  @Column('datetime', { nullable: true })
  endTime?: Date;

  @ApiModelPropertyOptional({
    description: `If this is null, we have not yet received scores from the judges, or
      the scores are not yet ready for the public.
      If this is not null, the scores should be available for the public.` })
  @Column('datetime', { nullable: true })
  publishTime?: Date;

  @ApiModelProperty({ description: `Separates scheduled training runs from live performances`, enum: ParticipationType })
  @Column('int', { default: ParticipationType.Live })
  type: ParticipationType;

  @ApiModelProperty({ description: `The reference to the tournament this execution is to be performed under` })
  @ManyToOne(type => Tournament, tournament => tournament.schedule, { nullable: false/*, lazy: true*/ })
  @JoinColumn({ name: 'tournamentId' })
  tournament: Tournament;

  @Column('int')
  tournamentId: number;

  @ApiModelProperty({ description: `The type of discipline this execution is performing` })
  @ManyToOne(type => Discipline, { nullable: false })
  @JoinColumn({ name: 'disciplineId' })
  discipline: Discipline;
  disciplineName: string;
  disciplineSortOrder: number;

  divisions: Division[];
  divisionName: string;
  divisionSortOrder: number;

  @Column('int')
  disciplineId: number;

  @ApiModelProperty({ description: `The reference to the team performing this execution` })
  @ManyToOne(type => Team, { nullable: false/*, lazy: true*/ })
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @Column('int')
  teamId: number;

  @ApiModelPropertyOptional({ description: `The scores as given by the judges after execution` })
  @OneToMany(type => Score, score => score.participant, { cascade: ['insert', 'update'] })
  scores?: Score[];

  media?: Media;
  clubId?: number;
}
