import { ITournament } from './ITournament';
import { IDiscipline } from './IDiscipline';
import { ITournamentParticipantScore } from './ITournamentParticipantScore';
import { ITeam } from './ITeam';

export interface ITournamentParticipant {
  id: number;
  startTime: Date;
  startNumber: number;
  discipline: IDiscipline;
  team: ITeam;
  tournament: ITournament;
  scores: ITournamentParticipantScore[];
}
