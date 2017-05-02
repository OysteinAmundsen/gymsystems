import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';

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
  @Column({nullable: true})
  club: string;
}
