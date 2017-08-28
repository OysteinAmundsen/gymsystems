import { ITeam } from './ITeam';
import { IClub } from './IClub';
import { DivisionType } from './DivisionType';
import { Gender } from './Gender';
import { ITroop } from './ITroop';

export class IGymnast {
  id: number;
  name: string;
  birthYear: number;
  gender: Gender;
  team: ITeam[];
  troop: ITroop[];
  club: IClub;
}
