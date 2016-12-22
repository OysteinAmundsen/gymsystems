import { Table, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToMany } from 'typeorm';
import { TournamentParticipant } from './TournamentParticipant';
import { TournamentScoreGroup } from './TournamentScoreGroup';
import { TournamentDiscipline } from './TournamentDiscipline';

@Table()
export class Tournament {
  @PrimaryGeneratedColumn()
  id:number;

  @Column({ length: 200 })
  name:string;

  @Column({type: 'text', nullable: true})
  description:string;

  @Column()
  startDate:Date;

  @OneToMany(type => TournamentParticipant, schedule => schedule.tournament)
  schedule?: TournamentParticipant[];

  @OneToMany(type => TournamentDiscipline, disciplines => disciplines.tournament)
  disciplines?: TournamentDiscipline[];

  @OneToMany(type => TournamentScoreGroup, scoreGroups => scoreGroups.tournament)
  scoreGroups?: TournamentScoreGroup[];

}
