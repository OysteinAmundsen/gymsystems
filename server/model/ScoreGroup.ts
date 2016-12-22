import {Table, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';

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
  judges: number;
}
