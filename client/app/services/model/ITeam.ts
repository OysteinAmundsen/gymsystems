import { ITournament } from './ITournament';
import { IDiscipline } from './IDiscipline';
import { IDivision } from './IDivision';
import { IClub } from './IClub';
import { IMedia } from './IMedia';
import { IBelongsToClub } from './IBelongsToClub';
import { Classes } from './Classes';
import { IGymnast } from './IGymnast';

export interface ITeam extends IBelongsToClub {
  id: number;
  name: string;
  divisions: IDivision[];
  disciplines: IDiscipline[];
  tournament: ITournament;
  club: IClub;
  media: IMedia[];
  class: Classes;
  contestants: IGymnast[];
}
