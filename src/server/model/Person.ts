import { PrimaryGeneratedColumn, Column } from 'typeorm';

export abstract class Person {
  /**
  *
  */
  @PrimaryGeneratedColumn()
  id: number;

  /**
  * The full name
  */
  @Column('varchar', { unique: true, length: 100 })
  name: string;

  /**
   * Email address
   */
  @Column('varchar', { nullable: true })
  email: string;

  /**
   * Phone number
   */
  @Column('varchar', { nullable: true })
  phone: string;

  /**
   *
   */
  @Column('varchar', { nullable: true })
  allergies: string;

}
