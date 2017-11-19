import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Tournament } from './Tournament';
import { Team, Classes } from './Team';
import { Discipline } from './Discipline';
import { Score } from './Score';
import { Division, DivisionType } from './Division';

/**
 * Defines if this entry should be a part of the competitive
 * event, or if this entry is non-score giving training entry
 * happening pre-event.
 *
 * @export
 * @class ParticipationType
 */
export enum ParticipationType {
  Training = 1, Live = 2
}


/**
 * Marks one entry in the tournaments schedule
 *
 * @export
 * @class TeamInDiscipline
 */
@Entity()
export class TeamInDiscipline {
  /**
   *
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   *
   */
  @Column()
  sortNumber: number;

  /**
   *
   */
  @Column()
  startNumber: number;

  /**
   *
   */
  @Column()
  markDeleted: boolean;

  /**
   *
   */
  @Column({ nullable: true })
  startTime: Date;

  /**
   *
   */
  @Column({ nullable: true })
  endTime: Date;

  /**
   *
   */
  @Column({ nullable: true })
  publishTime: Date;

  /**
   *
   */
  @Column({ default: ParticipationType.Live })
  type: ParticipationType;

  /**
   *
   */
  @ManyToOne(type => Tournament, tournament => tournament.schedule, { nullable: false })
  @JoinColumn({name: 'tournament'})
  tournament: Tournament;

  /**
   *
   */
  @OneToOne(type => Discipline, { nullable: false })
  @JoinColumn({name: 'discipline'})
  discipline: Discipline;

  /**
   *
   */
  @OneToOne(type => Team, { nullable: false })
  @JoinColumn({name: 'team'})
  team: Team;

  /**
   *
   */
  @OneToMany(type => Score, score => score.participant, { cascadeInsert: true, cascadeUpdate: true })
  scores: Score[];

  /**
   *
   */
  get disciplineName(): string {
    return (this.team.class === Classes.TeamGym ? 'TG: ' : '') + this.discipline.name;
  }

  /**
   *
   */
  get division(): string {
    const ageDivision = (team: Team): Division => team.divisions.find(d => d.type === DivisionType.Age);
    const genderDivision = (team: Team): Division => team.divisions.find(d => d.type === DivisionType.Gender);
    return `${genderDivision(this.team).name} ${ageDivision(this.team).name}`;
  }

  /**
   *
   */
  get total(): number {
    return this.discipline.scoreGroups.reduce((prev, curr) => {
      const scores = this.scores.filter(s => s.scoreGroup.id === curr.id);
      return prev += scores.length ? scores.reduce((p, c) => p += c.value, 0) / scores.length : 0;
    }, 0);
  }
}
