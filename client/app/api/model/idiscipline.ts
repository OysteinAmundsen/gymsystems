export interface IDiscipline {
  name: string;
}
export class Discipline implements IDiscipline {
  static mapTo(json: IDiscipline | IDiscipline[]): Discipline | Discipline[] {
    if (Array.isArray(json)) {
      return json.map((item: IDiscipline) => new Discipline(item.name));
    } else {
      return new Discipline(json.name);
    }
  }
  constructor(public name: string) { }
}
