import { Table, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TournamentParticipant } from './TournamentParticipant';
import { TournamentScoreGroup } from './TournamentScoreGroup';
import { TournamentDiscipline } from './TournamentDiscipline';

@Table()
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({type: 'text', nullable: true})
  description: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  location: string;

  @OneToMany(type => TournamentParticipant, schedule => schedule.tournament)
  schedule?: TournamentParticipant[];

  @OneToMany(type => TournamentDiscipline, disciplines => disciplines.tournament)
  disciplines?: TournamentDiscipline[];

  @OneToMany(type => TournamentScoreGroup, scoreGroups => scoreGroups.tournament)
  scoreGroups?: TournamentScoreGroup[];

}
