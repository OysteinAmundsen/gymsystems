import { ITeam } from './ITeam';
import { IClub } from './IClub';
import { DivisionType } from './DivisionType';
import { Gender } from './Gender';
import { ITroop } from './ITroop';
import { IBelongsToClub } from './IBelongsToClub';

export interface IGymnast extends IBelongsToClub {
  id: number;
  name: string;
  birthYear: number;
  gender: Gender;
  team: ITeam[];
  troop: ITroop[];
}
