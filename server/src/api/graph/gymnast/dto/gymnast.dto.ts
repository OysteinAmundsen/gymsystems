export class GymnastDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  allergies: string;
  birthYear: number;
  birthDate: Date;
  gender: number;
  guardian1: string;
  guardian1Phone: string;
  guardian1Email: string;
  guardian2: string;
  guardian2Phone: string;
  guardian2Email: string;
  clubId: number;
  troop: { id: number }[];
  team: { id: number }[];
  lodging: { id: number }[];
  transport: { id: number }[];
  banquet: { id: number }[];

}
