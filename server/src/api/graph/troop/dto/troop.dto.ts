
export class TroopDto {
  id: number;
  name: string;
  club: { id: number };
  gymnasts?: { id: number }[];
}
