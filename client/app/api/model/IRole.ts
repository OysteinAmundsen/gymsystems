export interface IRole {
  name: string;
  authLevel: number;
}

export class Role implements IRole {
  static System: Role = new Role('System', 90);
  static Secretariat: Role = new Role('Secretariat', 10);
  static Judge: Role = new Role('Judge', 6);
  static Trainer: Role = new Role('Trainer', 5);
  static LoggedIn: Role = new Role('LoggedIn', 1);
  static Anonymous: Role = new Role('Anonymous', 0);

  static mapTo(json: IRole | IRole[]): Role | Role[] {
    if (Array.isArray(json)) {
      return json.map((item: IRole) => new Role(item.name, item.authLevel));
    } else {
      return new Role(json.name, json.authLevel);
    }
  }

  constructor(public name: string, public authLevel: number) { }
}
