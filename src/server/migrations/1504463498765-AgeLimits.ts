import { Connection, EntityManager, MigrationInterface, QueryRunner } from 'typeorm';

export class AgeLimits1504463498765 implements MigrationInterface {

  async up(queryRunner: QueryRunner): Promise<any> { // Next-gen Typeorm
    await queryRunner.insert('configuration', {
       name: 'ageLimits',
       value: JSON.stringify({
         aspirant: {min: 8, max: 11},
         rekrutt: {min: 11, max: 13},
         junior: {min: 13, max: 17},
         senior: {min: 16, max: 99},
       })
     });
   }

  async down(queryRunner: QueryRunner): Promise<any> { // Next-gen Typeorm
    await queryRunner.delete('configuration', { 'name': 'ageLimits' });
  }

}
