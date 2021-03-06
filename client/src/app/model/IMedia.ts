import { IDiscipline } from './IDiscipline';
import { ITeam } from './ITeam';
import { ITournament } from './ITournament';

export interface IMedia {
  disciplineName: string;
  clubId: number;
  id: number;
  fileName: string;
  originalName: string;
  mimeType: string;
  disciplineId: number;
  discipline: IDiscipline;
  teamId: number;
  team: ITeam;
  tournamentId: number;
  tournament: ITournament;
  isPlaying: boolean;
}
