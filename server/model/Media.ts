import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, Index, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Team } from './Team';
import { Discipline } from './Discipline';
import { Division, DivisionType } from './Division';
import { Tournament } from './Tournament';

/**
 *
 *
 * @export
 * @class Media
 */
@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  filename: string;

  @OneToOne(type => Discipline, { nullable: false })
  @JoinColumn()
  discipline: Discipline;

  @OneToOne(type => Team, { nullable: false })
  @JoinColumn()
  team: Team;

  @ManyToOne(type => Tournament, tournament => tournament.media, { nullable: false, onDelete: 'CASCADE' })
  tournament: Tournament;

  get division(): string {
    const ageDivision = (team: Team): Division => team.divisions.find(d => d.type === DivisionType.Age);
    const genderDivision = (team: Team): Division => team.divisions.find(d => d.type === DivisionType.Gender);
    return `${genderDivision(this.team).name} ${ageDivision(this.team).name}`;
  }
}
