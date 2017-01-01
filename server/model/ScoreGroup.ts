import {Table, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * Defines a ScoreGroup type
 */
@Table()
export class ScoreGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column()
  type: string;

  @Column()
  judges: number;

  @Column()
  max: number;

  @Column()
  min: number;
}
