import { ITournament } from './ITournament';
import { IDiscipline } from './IDiscipline';
import { IScore } from './IScore';
import { ITeam } from './ITeam';
import { ParticipationType } from './ParticipationType';

export interface ITeamInDiscipline {
  id: number;
  startNumber: number;
  startTime: Date;
  endTime: Date;
  publishTime: Date;
  type: ParticipationType;
  discipline: IDiscipline;
  team: ITeam;
  tournament: ITournament;
  scores: IScore[];
}
