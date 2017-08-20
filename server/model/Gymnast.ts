import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, Index, OneToMany } from 'typeorm';
import { Club, BelongsToClub } from './Club';
import { DivisionType } from './Division';
import { Team } from './Team';

export enum Gender {
  Male = 1, Female = 2
}

/**
 *
 */
@Entity()
export class Gymnast implements BelongsToClub {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column()
  birthYear: number;

  @Column()
  gender: Gender;

  @ManyToMany(type => Team, team => team.gymnasts, { cascadeInsert: false, cascadeUpdate: false })
  @JoinTable()
  team: Team[];

  @ManyToOne(type => Club, club => club.teams, { nullable: false })
  club: Club;

}
