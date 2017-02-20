import { Team } from './Team';
import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';

/**
 *
 */
@Entity()
export class AgeClass {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(type => Team, teams => teams.ageClass)
  teams?: Team[];
}
