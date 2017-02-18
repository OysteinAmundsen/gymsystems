import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200, unique: true })
  name: string;

  @Column({type: 'text', nullable: true})
  description?: string;
}
