import { ITournament } from './ITournament';
import { IDiscipline } from './IDiscipline';
import { ITournamentParticipantScore } from './ITournamentParticipantScore';
import { ITeam } from './ITeam';

export interface ITournamentParticipant {
  id: number;
  startNumber: number;
  startTime: Date;
  endTime: Date;
  publishTime: Date;
  discipline: IDiscipline;
  team: ITeam;
  tournament: ITournament;
  scores: ITournamentParticipantScore[];
}
