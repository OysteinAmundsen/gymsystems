import { ITeam } from "./ITeam";
import { IClub } from "./IClub";
import { DivisionType } from "./DivisionType";
import { Gender } from "./Gender";

export class IClubContestant {
  id: number;
  name: string;
  ageDivision: DivisionType;
  gender: Gender;
  partof: ITeam[];
  club: IClub;

}
