import { Connection, EntityManager, MigrationInterface, QueryRunner, getConnection } from 'typeorm';
import { Configuration } from '../model/Configuration';

export class AgeLimits1504463498765 implements MigrationInterface {

  async up(queryRunner: QueryRunner): Promise<any> { // Next-gen Typeorm
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Configuration)
      .values([{
        name: 'ageLimits',
        value: JSON.stringify({
          aspirant: {min: 8, max: 11},
          rekrutt: {min: 11, max: 13},
          junior: {min: 13, max: 17},
          senior: {min: 16, max: 99},
        })
      }])
      .execute();
   }

  async down(queryRunner: QueryRunner): Promise<any> { // Next-gen Typeorm
    await getConnection().createQueryBuilder().delete().from(Configuration).where({ 'name': 'ageLimits' }).execute();
  }
}
