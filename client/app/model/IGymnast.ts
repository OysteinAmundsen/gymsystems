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
  birthDate?: Date;
  email?: string;
  phone?: number;
  gender: Gender;
  allergies?: string;
  guardian1?: string;
  guardian2?: string;
  guardian1Phone?: number;
  guardian2Phone?: number;
  guardian1Email?: string;
  guardian2Email?: string;
  troop: ITroop[];
  team: ITeam[];
}
