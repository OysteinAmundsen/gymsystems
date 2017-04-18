import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';

export enum Role {
  Admin = 99, Secretariat = 80, Club = 50, User = 10
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 100 })
  password: string;

  @Column()
  role: Role;
}
