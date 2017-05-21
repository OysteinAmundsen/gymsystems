import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Club, BelongsToClub } from './Club';
import { Tournament } from './Tournament';

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

export interface CreatedBy {
  createdBy: User;
}


@Entity()
export class User implements BelongsToClub {
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

  @OneToMany(type => Tournament, tournaments => tournaments.createdBy)
  tournaments: Tournament[];
}
