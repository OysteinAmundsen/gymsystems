import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';

import { Discipline } from './Discipline';
import { Division } from './Division';
import { Team } from './Team';
import { TeamInDiscipline } from './TeamInDiscipline';
import { User, CreatedBy } from './User';
import { Media } from './Media';

@Entity()
export class Tournament implements CreatedBy {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.tournaments, {nullable: false})
  createdBy: User;

  @Column({ unique: true, length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description_no: string;

  @Column({ type: 'text', nullable: true })
  description_en: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({type: 'json', nullable: true})
  times: {day: Date, time: string}[];

  @Column()
  location: string;

  @OneToMany(type => TeamInDiscipline, schedule => schedule.tournament)
  schedule: TeamInDiscipline[];

  @OneToMany(type => Discipline, disciplines => disciplines.tournament, { cascadeInsert: true })
  disciplines: Discipline[];

  @OneToMany(type => Division, divisions => divisions.tournament, { cascadeInsert: true })
  divisions: Division[];

  @OneToMany(type => Team, teams => teams.tournament)
  teams: Team[];

  @OneToMany(type => Media, media => media.tournament)
  media: Media[];
}
