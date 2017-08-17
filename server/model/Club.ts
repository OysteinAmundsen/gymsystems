import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, Index, OneToMany, OneToOne } from 'typeorm';
import { Tournament } from './Tournament';
import { Discipline } from './Discipline';
import { Division } from './Division';
import { Team } from './Team';
import { User } from './User';


export interface BelongsToClub {
  club: Club;
}
/**
 *
 *
 * @export
 * @class Club
 */
@Entity()
export class Club {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  name: string;

  @OneToMany(type => Team, teams => teams.club, { cascadeInsert: false, cascadeUpdate: false })
  teams: Team[] = [];

  @OneToMany(type => User, users => users.club, { cascadeInsert: false, cascadeUpdate: false })
  users: User[];
}
