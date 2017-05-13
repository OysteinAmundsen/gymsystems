import { ITournament } from './ITournament';
import { IDiscipline } from './IDiscipline';
import { IDivision } from './IDivision';
import { IClub } from './IClub';
import { IMedia } from './IMedia';

export interface ITeam {
  id: number;
  name: string;
  divisions: IDivision[];
  disciplines: IDiscipline[];
  tournament: ITournament;
  club: IClub;
  media: IMedia[];
}
