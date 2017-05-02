import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Club } from './Club';

export enum Role {
  Admin = 99, Secretariat = 80, Club = 50, User = 10
}

export const RoleNames: [{id: number, name: string}] = [
  {id: Role.Admin,       name: 'Admin'},
  {id: Role.Secretariat, name: 'Secretariat'},
  {id: Role.Club,        name: 'Club'},
  {id: Role.User,        name: 'User'},
]

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 100, nullable: true})
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column()
  role: Role;

  @ManyToOne(type => Club, club => club.users, { nullable: true })
  club: Club;
}
