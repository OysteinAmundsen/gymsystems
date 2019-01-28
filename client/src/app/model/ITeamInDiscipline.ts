import {Moment } from 'moment';

import { ITournament } from './ITournament';
import { IDiscipline } from './IDiscipline';
import { IScore } from './IScore';
import { ITeam } from './ITeam';
import { ParticipationType } from './ParticipationType';
import { IDivision } from './IDivision';
import { IScoreGroup } from './IScoreGroup';

export interface TotalByScoreGroup {
  group: IScoreGroup;
  total: number;
}

export interface ITeamInDiscipline {
  id: number;
  startNumber: number;
  sortNumber: number;
  startTime: Date;
  markDeleted: boolean;
  calculatedStartTime?: Moment; // Exists only on client side
  endTime: Date;
  publishTime: Date;
  type: ParticipationType;
  disciplineId: number;
  discipline: IDiscipline;
  disciplineName: string;
  disciplineSortOrder: number;
  divisions: IDivision[];
  divisionName: string;
  divisionSortOrder: string;
  scorable: boolean;
  teamId: number;
  team: ITeam;
  tournamentId: number;
  tournament: ITournament;
  scores: IScore[];
  total: string;
  totalByScoreGroup: TotalByScoreGroup[]

}
