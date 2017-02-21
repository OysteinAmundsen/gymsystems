import { IDiscipline } from './IDiscipline';

export interface IScoreGroup {
  id: number;
  name: string;
  type: string;
  judges: number;
  max: number;
  min: number;
  discipline: IDiscipline;
  operation: Operation;
}

export enum Operation {
  Addition = 1, Subtraction = 2
}
