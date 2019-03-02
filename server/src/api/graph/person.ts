import { PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';


/**
 * Common properties used by every entity describing persons in different roles.
 *  - Gymnast
 *  - Judge
 */
export abstract class Person {
  @ApiModelProperty({ description: `The primary key` })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty({ description: `The full name` })
  @Column('varchar', { unique: true, length: 100 })
  name: string;

  @ApiModelProperty({ description: `Email address` })
  @Column('varchar', { nullable: true })
  email: string;

  @ApiModelProperty({ description: `Phone number` })
  @Column('varchar', { nullable: true })
  phone: string;

  @ApiModelPropertyOptional({ description: `A textual list of allergies. This is useful for event organizers, when planning food dispension` })
  @Column('varchar', { nullable: true })
  allergies?: string;
}
