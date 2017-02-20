import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm';
import { Discipline } from './Discipline';
import { AgeClass } from './AgeClass';
import { Class } from './Class';

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

  @ManyToOne(type => Class, clazz => clazz.teams)
  clazz: Class;

  @ManyToOne(type => AgeClass, ageClass => ageClass.teams)
  ageClass: AgeClass;

  @ManyToMany(type => Discipline, discipline => discipline.teams)
  disciplines?: Discipline[];
}
