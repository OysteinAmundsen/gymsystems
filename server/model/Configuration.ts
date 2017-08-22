import { ScoreGroup } from './ScoreGroup';
import { Tournament } from './Tournament';
import { Team } from './Team';
import { PrimaryColumn, Column, Entity } from 'typeorm';

/**
 * System Configuration described via key/value objects
 * where the value is usually some json object containing
 * even more configuration.
 *
 * @export
 * @class Configuration
 */
@Entity()
export class Configuration {
  /**
   * The key
   */
  @PrimaryColumn()
  name: string;

  /**
   * The value
   */
  @Column({ type: 'json', nullable: true })
  value: any;
}
