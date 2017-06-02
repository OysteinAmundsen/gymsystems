import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, Index, OneToMany } from 'typeorm';
import { Club, BelongsToClub } from './Club';
import { DivisionType } from './Division';
import { Team } from "./Team";

/**
 *
 */
@Entity()
export class ClubContestant implements BelongsToClub {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column()
  ageDivision: DivisionType;

  @Column()
  genderDivision: DivisionType;

  @ManyToMany(type => Team, team => team.contesters)
  partof: Team[];

  @ManyToOne(type => Club, club => club.teams, { nullable: false, onDelete: 'CASCADE' })
  club: Club;

}
