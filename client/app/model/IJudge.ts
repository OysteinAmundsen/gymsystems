import { IScoreGroup } from './IScoreGroup';

export interface IJudge {
  id: number;
  name: string;
  email: string;
  phone: string;
  allergies: string;
  scoreGroups: IScoreGroup[];
}

export class Judge implements IJudge {
  id = null;
  name = null;
  email = null;
  phone = null;
  allergies = null;
  scoreGroups = null;

  constructor() {
  }
}
