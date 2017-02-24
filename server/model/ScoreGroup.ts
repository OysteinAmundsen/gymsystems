import { Discipline } from './Discipline';
import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from 'typeorm';

export enum Operation {
  Addition = 1, Subtraction = 2
}

/**
 * Defines a ScoreGroup type
 */
@Entity()
export class ScoreGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column()
  type: string;

  @Column()
  operation: Operation = Operation.Addition;

  @Column()
  judges: number;

  @Column()
  max: number;

  @Column()
  min: number;

  @ManyToOne(type => Discipline, discipline => discipline.scoreGroups, {
    nullable: false, cascadeInsert: false, cascadeUpdate: false, cascadeRemove: true, onDelete: 'CASCADE'
  })
  discipline: Discipline;
}
