import { Connection, EntityManager, MigrationInterface, QueryRunner, getConnection } from 'typeorm';
import { Configuration } from '../model/Configuration';

export class ScheduleExecutionTime1494843042816 implements MigrationInterface {

  async up(queryRunner: QueryRunner): Promise<any> { // Next-gen Typeorm
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Configuration)
      .values([{
        name: 'scheduleExecutionTime',
        value: '5'
      }])
      .execute();
  }

  async down(queryRunner: QueryRunner): Promise<any> { // Next-gen Typeorm
    await getConnection().createQueryBuilder().delete().from(Configuration).where({ 'name': 'scheduleExecutionTime' }).execute();
  }
}
