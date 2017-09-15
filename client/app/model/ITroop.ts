import { IClub } from './IClub';
import { IMedia } from './IMedia';
import { IBelongsToClub } from './IBelongsToClub';
import { IGymnast } from './IGymnast';

export interface ITroop extends IBelongsToClub {
  id: number;
  name: string;
  gymnasts: IGymnast[];
  media: IMedia[];
}
