import { IClub } from './IClub';

export enum Role {
  Admin = 99, Organizer = 90, Secretariat = 80, Club = 50, User = 10
}

export const RoleNames: [{id: number, name: string}] = [
  {id: Role.Admin,       name: 'Admin'},
  {id: Role.Organizer,   name: 'Organizer'},
  {id: Role.Secretariat, name: 'Secretariat'},
  {id: Role.Club,        name: 'Club'},
  {id: Role.User,        name: 'User'},
]

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role?: Role;
  club: IClub;
}
