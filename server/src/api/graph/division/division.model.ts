import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, ManyToOne, Index, JoinColumn, JoinTable } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Tournament } from '../tournament/tournament.model';
import { Team } from '../team/team.model';
import { Troop } from '../troop/troop.model';


/**
 * Describe the type of division
 */
export enum DivisionType {
  Age = 1,
  Gender = 2
}

/**
 * A Division object describes one half of the actual division
 * the gymnasts are competing in. You will need a division pair
 * in order to get the whole picture.
 *
 * A gymnast competes in an Age/Gender type division. So the gymnast
 * is both in a Age Division and in a Gender division. The age division
 * is locked by physical age of the gymnast, but a gender division can
 * be both the actual gender of the gymnast as well as a special division
 * called 'Mix'.
 *
 * To elaborate, "John Gymnast" can be both in:
 *  - Rekrutt Herrer
 *  - Rekrutt Mix
 * where 'Rekrutt' is the Age division and 'Herrer'/'Mix' is the gender
 * division.
 */
@Entity()
@Index('division_tournament_name', (division: Division) => [division.name, division.tournament], { unique: true })
export class Division {
  @ApiModelProperty({ description: `The Division primary key` })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty({ description: `A descriptive name for this division` })
  @Column('varchar')
  name: string;

  @ApiModelProperty({ description: `A numeric representation of how this object should be sorted` })
  @Column('int', { default: 0 })
  sortOrder: number;

  @ApiModelProperty({ description: `Define if this is a Gender type or Age type division`, enum: DivisionType })
  @Column('int')
  type: DivisionType;

  @ApiModelPropertyOptional({ description: `Only used for divisions of type Age. Describes the minimum age limit for gymnasts in this division` })
  @Column('int', { nullable: true })
  min?: number;

  @ApiModelPropertyOptional({ description: `Only used for divisions of type Age. Describes the maximum age limit for gymnasts in this division` })
  @Column('int', { nullable: true })
  max?: number;

  @ApiModelProperty({
    description: `Only used for divisions of type Age
      Describes wheather or not this division should be something the assigned judges should score or not.
      The youngest participants should not be judged.`
  })
  @Column('tinyint', { default: true })
  scorable: boolean;

  @ApiModelProperty({ description: `The tournament where this division is to be competed in` })
  @ManyToOne(type => Tournament, tournament => tournament.divisions, { nullable: false/*, lazy: true*/ })
  @JoinColumn({ name: 'tournamentId' })
  tournament: Tournament;

  @Column('int')
  tournamentId: number;

  @ApiModelPropertyOptional({ description: `A reference to the teams competing in this division` })
  @ManyToMany(type => Team, teams => teams.divisions)
  teams?: Team[];

  @ApiModelPropertyOptional({ description: `A reference to the troops configured for this division` })
  @ManyToMany(type => Troop, troops => troops.divisions)
  troops?: Troop[];
}
