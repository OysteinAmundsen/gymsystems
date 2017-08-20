import { ITeam } from './ITeam';
import { IClub } from './IClub';
import { DivisionType } from './DivisionType';
import { Gender } from './Gender';

export class IGymnast {
  id: number;
  name: string;
  birthYear: number;
  gender: Gender;
  partof: ITeam[];
  club: IClub;
}
