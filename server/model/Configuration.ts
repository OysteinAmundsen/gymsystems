import { ScoreGroup } from './ScoreGroup';
import { Tournament } from './Tournament';
import { Team } from './Team';
import { PrimaryColumn, Column, Entity } from 'typeorm';

/**
 * Describes the available disciplines in this sport.
 */
@Entity()
export class Configuration {
  @PrimaryColumn()
  name: string;

  @Column({ type: 'json', nullable: true })
  value: any;
}
