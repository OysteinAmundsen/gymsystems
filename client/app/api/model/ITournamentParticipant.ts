import { ITournament } from './ITournament';
import { ITournamentDiscipline } from './ITournamentDiscipline';
import { ITournamentParticipantScore } from './ITournamentParticipantScore';
import { ITeam } from './ITeam';

export interface ITournamentParticipant {
  id: number;
  startTime: Date;
  startNumber: number;
  discipline: ITournamentDiscipline;
  team: ITeam;
  tournament: ITournament;
  scores: ITournamentParticipantScore[];
}
