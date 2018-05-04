import { ScoreGroup } from './ScoreGroup';
import { Tournament } from './Tournament';
import { Team } from './Team';
import { PrimaryGeneratedColumn, Column, Entity, OneToMany, ManyToOne, ManyToMany, Index, JoinColumn } from 'typeorm';

 /**
 * Describes the available disciplines in this tournament.
 *
 * @export
 * @class Discipline
 */
@Entity()
@Index('discipline_tournament_name', (discipline: Discipline) => [discipline.name, discipline.tournament], { unique: true })
export class Discipline {
  /**
   * The Discipline primary key
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * A descriptive name for this discipline
   */
  @Column('varchar')
  name: string;

  /**
   * A numeric representation of how this object should be sorted
   */
  @Column('int', { default: 0 })
  sortOrder?: number;

  /**
   * A reference to the teams competing in this discipline
   */
  @ManyToMany(type => Team, team => team.disciplines)
  teams: Team[];

  /**
   * The tournament where this discipline is to be competed in
   */
  @ManyToOne(type => Tournament, tournament => tournament.disciplines, { nullable: false })
  @JoinColumn({name: 'tournament'})
  tournament: Tournament;

  /**
   * The scoregroup configuration for this discipline
   */
  @OneToMany(type => ScoreGroup, scoreGroup => scoreGroup.discipline)
  scoreGroups: ScoreGroup[];
}
