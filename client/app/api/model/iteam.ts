import { IDiscipline, Discipline } from './iDiscipline';
import { ITrainerUser, Trainer } from '../user.service';

export interface ITeam {
  name: string;
  disciplines: IDiscipline[];
  trainer: ITrainerUser;
}

export class Team implements ITeam {
  static mapTo(json: ITeam | ITeam[]): Team | Team[] {
    if (Array.isArray(json)) {
      return json.map((item: ITeam) => new Team(item.name, <Discipline[]>Discipline.mapTo(item.disciplines), <Trainer>Trainer.mapTo(item.trainer)));
    } else {
      return new Team(json.name, <Discipline[]>Discipline.mapTo(json.disciplines), <Trainer>Trainer.mapTo(json.trainer));
    }
  }
  constructor(public name: string, public disciplines: IDiscipline[], public trainer: ITrainerUser) { }
}
