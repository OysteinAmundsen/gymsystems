import { PrimaryGeneratedColumn, Column, Table } from 'typeorm';

/**
 * Describes the available disciplines in this sport.
 * A selected is not required to implement all these, but rather
 * this describes what can be implemented in a selected.
 */
@Table()
export class Discipline {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  name: string;
}
