import { PrimaryGeneratedColumn, Column, Table } from 'typeorm';

/**
 * Describes the available disciplines in this sport.
 * A tournament is not required to implement all these, but rather
 * this describes what can be implemented in a tournament.
 */
@Table()
export class Discipline {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  name: string;
}
