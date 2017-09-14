import { IDiscipline } from './IDiscipline';
import { ITeam } from './ITeam';
import { ITournament } from './ITournament';

export interface IMedia {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  discipline: IDiscipline;
  team: ITeam;
  tournament: ITournament;
  isPlaying: boolean;
}
