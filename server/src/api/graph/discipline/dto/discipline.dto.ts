import { ValidateIf, IsNotEmpty } from 'class-validator';

export class DisciplineDto {
  /**
   * The Discipline primary key
   *
   * @required if no name is given.
   */
  @ValidateIf(o => !o.name)
  id?: number;

  /**
   * A descriptive name for this discipline
   *
   * @required if no id is given.
   */
  @ValidateIf(o => !o.id)
  name?: string;

  /**
   * A numeric representation of how this object should be sorted
   */
  @IsNotEmpty()
  sortOrder: number;

  /**
   * The id of the tournament where this discipline is to be competed in
   *
   * @required
   */
  @IsNotEmpty()
  tournamentId: number;

  /**
   * The scoregroup configuration for this discipline
   */
  scoreGroups?: { id: number }[];
}
