import { PrimaryColumn, Column, Entity } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';


/**
 * System Configuration described via key/value objects
 * where the value is usually some json object containing
 * even more configuration.
 */
@Entity()
export class Configuration {
  @ApiModelProperty({ description: 'The configuration key' })
  @PrimaryColumn('varchar')
  name: string;

  @ApiModelProperty({ description: 'The configuration value' })
  @Column({ type: 'json', nullable: true })
  value?: any;
}
