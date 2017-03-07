export enum Role {
  Admin = 99, Secretariat = 80, Club = 50, User = 10
}

export interface IUser {
  name: string;
  password: string;
  role?: Role;
}
