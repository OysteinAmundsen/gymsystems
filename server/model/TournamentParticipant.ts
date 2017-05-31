import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Tournament } from './Tournament';
import { Team, Classes } from './Team';
import { Discipline } from './Discipline';
import { TournamentParticipantScore } from './TournamentParticipantScore';
import { Division, DivisionType } from './Division';

export enum ParticipationType {
  Training = 1, Live = 2
}
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

  @Column({ default: ParticipationType.Live })
  type: ParticipationType;

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

  get disciplineName(): string {
    return (this.team.class === Classes.TeamGym ? 'TG: ' : '') + this.discipline.name;
  }

  get division(): string {
    const ageDivision = (team: Team): Division => team.divisions.find(d => d.type === DivisionType.Age);
    const genderDivision = (team: Team): Division => team.divisions.find(d => d.type === DivisionType.Gender);
    return `${genderDivision(this.team).name} ${ageDivision(this.team).name}`;
  }

  get total(): number {
    return this.discipline.scoreGroups.reduce((prev, curr) => {
      const scores = this.scores.filter(s => s.scoreGroup.id === curr.id);
      return prev += scores.length ? scores.reduce((p, c) => p += c.value, 0) / scores.length : 0;
    }, 0);
  }
}
