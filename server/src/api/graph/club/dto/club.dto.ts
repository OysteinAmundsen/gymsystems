import { ValidateIf } from 'class-validator';

export class ClubDto {
  /**
   * The Club primary key.
   *
   * @required if no name is given.
   */
  @ValidateIf(o => !o.name)
  id: number;

  /**
   * A unique name for the club. This will take suggestions from http://www.brreg.no,
   * but can be customized if needed. We do however recommend that the name returned
   * from Brønnøysund is kept, as we might fetch more information from this registry
   * in the future, in order to present users with more details about your club.
   *
   * @required if no id is given.
   */
  @ValidateIf(o => !o.id)
  name: string;

  // OPTIONAL -------------------------------------

  troops?: { id: number }[];
  teams?: { id: number }[];
  tournaments?: { id: number }[];
  users?: { id: number }[];
  gymnasts?: { id: number }[];
}
