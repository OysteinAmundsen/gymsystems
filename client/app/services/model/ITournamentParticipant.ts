import { ITournament } from './ITournament';
import { IDiscipline } from './IDiscipline';
import { ITournamentParticipantScore } from './ITournamentParticipantScore';
import { ITeam } from './ITeam';
import { ParticipationType } from "./ParticipationType";

export interface ITournamentParticipant {
  id: number;
  startNumber: number;
  startTime: Date;
  endTime: Date;
  publishTime: Date;
  type: ParticipationType;
  discipline: IDiscipline;
  team: ITeam;
  tournament: ITournament;
  scores: ITournamentParticipantScore[];
}
