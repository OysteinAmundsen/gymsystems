import { DivisionType } from '../division.model';

export class DivisionDto {
  id: number;
  name: string;
  sortOrder: number;
  type: DivisionType;
  min?: number;
  max?: number;
  scorable: boolean;
  tournamentId: number;
  teams?: { id: number }[];
}
