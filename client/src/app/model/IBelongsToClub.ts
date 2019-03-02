import { IClub } from 'app/model';

export interface IBelongsToClub {
  clubId: number;
  club: IClub;
}
