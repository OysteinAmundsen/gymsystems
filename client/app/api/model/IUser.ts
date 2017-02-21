import { IRole, Role } from './IRole';
import { IDiscipline } from './IDiscipline';

export interface IUser {
  name: string;
  password: string;
  role?: IRole;
}
export interface IJudgeUser extends IUser {
  disciplines: IDiscipline[];
  type: JudgeType;
}
export interface ITrainerUser extends IUser {
}

// User type implementations
export class User implements IUser {
  public static Anonymous: User = new User('Admin', null, Role.System); // Anonymous); //
  constructor(public name: string, public password: string, public role?: IRole) { }
}
export class Judge extends User implements IJudgeUser {
  constructor(
    public name: string,
    public password: string,
    public role: IRole,
    public disciplines: IDiscipline[],
    public type: JudgeType
  ) {
    super(name, password, role);
  }
}
export enum JudgeType {
  Execution,
  Difficulty,
  Composition
}
export class Trainer extends User implements ITrainerUser {
  static mapTo(json: ITrainerUser | ITrainerUser[]): Trainer | Trainer[] {
    if (Array.isArray(json)) {
      return json.map((item: ITrainerUser) => new Trainer(item.name, item.password, <Role>Role.mapTo(item.role)));
    } else {
      return new Trainer(json.name, json.password, <Role>Role.mapTo(json.role));
    }
  }
  constructor(
    public name: string,
    public password: string,
    public role: IRole
  ) {
    super(name, password, role);
  }
}
