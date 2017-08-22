import { ScoreGroup } from './ScoreGroup';
import { Tournament } from './Tournament';
import { Team } from './Team';
import { PrimaryGeneratedColumn, Column, Entity, OneToMany, ManyToOne, ManyToMany, JoinTable, Index } from 'typeorm';

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
  @Column()
  name: string;

  /**
   * A numeric representation of how this object should be sorted
   */
  @Column({ default: 0 })
  sortOrder?: number;

  /**
   * A reference to the teams competing in this discipline
   */
  @ManyToMany(type => Team, team => team.disciplines, { cascadeInsert: false, cascadeUpdate: false })
  teams: Team[];

  /**
   * The tournament where this discipline is to be competed in
   */
  @ManyToOne(type => Tournament, tournament => tournament.disciplines, {
    nullable: false, cascadeInsert: false, cascadeUpdate: false, cascadeRemove: true, onDelete: 'CASCADE'
  })
  tournament: Tournament;

  /**
   * The scoregroup configuration for this discipline
   */
  @OneToMany(type => ScoreGroup, scoreGroup => scoreGroup.discipline, { cascadeInsert: false, cascadeUpdate: false })
  scoreGroups: ScoreGroup[];
}
