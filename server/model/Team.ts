import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Discipline } from './Discipline';
import { Division } from './Division';

/**
 *
 *
 * @export
 * @class Team
 */
@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @ManyToMany(type => Division, division => division.teams, { cascadeInsert: false, cascadeUpdate: false })
  @JoinTable()
  divisions: Division[];

  @ManyToMany(type => Discipline, discipline => discipline.teams, { cascadeInsert: false, cascadeUpdate: false })
  @JoinTable()
  disciplines: Discipline[];
}
