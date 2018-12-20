import { ParticipationType } from '../team-in-discipline.model';

export class TeamInDisciplineDto {
  id: number;
  sortNumber: number;
  startNumber: number;
  markDeleted: boolean;
  startTime?: Date;
  endTime?: Date;
  publishTime?: Date;
  type: ParticipationType;
  tournamentId: number;
  disciplineId: number;
  teamId: number;
}
