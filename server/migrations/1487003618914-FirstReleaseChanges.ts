import { MigrationInterface, QueryRunner, Connection, EntityManager } from "typeorm";

export class FirstReleaseChanges1487003618914 implements MigrationInterface {

  async up(queryRunner: QueryRunner, connection: Connection, entityManager?: EntityManager): Promise<any> {
    await queryRunner.insert('class', { 'name': 'Kvinner' });
    await queryRunner.insert('class', { 'name': 'Herrer' });
    await queryRunner.insert('class', { 'name': 'Mix' });

    await queryRunner.insert('age_class', { 'name': 'Rekrutt' });
    await queryRunner.insert('age_class', { 'name': 'Junior' });
    await queryRunner.insert('age_class', { 'name': 'Senior' });

    await queryRunner.insert('discipline', { 'name': 'Frittstående' });
    await queryRunner.insert('discipline', { 'name': 'Tumbling' });
    await queryRunner.insert('discipline', { 'name': 'Trampett' });

    await queryRunner.insert('score_group', { 'name': 'Composition', 'type': 'C', 'operation': 1, 'judges': 2, 'max': 5, 'min': 0 });
    await queryRunner.insert('score_group', { 'name': 'Execution', 'type': 'E', 'operation': 1, 'judges': 4, 'max': 10, 'min': 0 });
    await queryRunner.insert('score_group', { 'name': 'Difficulty', 'type': 'D', 'operation': 1, 'judges': 2, 'max': 5, 'min': 0 });
    await queryRunner.insert('score_group', { 'name': 'Adjustments', 'type': 'HJ', 'operation': 2, 'judges': 1, 'max': 5, 'min': 0 });
  }

  async down(queryRunner: QueryRunner, connection: Connection, entityManager?: EntityManager): Promise<any> {
    await queryRunner.delete('class', { 'name': 'Kvinner' });
    await queryRunner.delete('class', { 'name': 'Herrer' });
    await queryRunner.delete('class', { 'name': 'Mix' });

    await queryRunner.delete('age_class', { 'name': 'Rekrutt' });
    await queryRunner.delete('age_class', { 'name': 'Junior' });
    await queryRunner.delete('age_class', { 'name': 'Senior' });

    await queryRunner.delete('discipline', { 'name': 'Frittstående' });
    await queryRunner.delete('discipline', { 'name': 'Tumbling' });
    await queryRunner.delete('discipline', { 'name': 'Trampett' });

    await queryRunner.delete('score_group', { 'name': 'Composition', 'type': 'C', 'judges': 2, 'max': 5, 'min': 0 });
    await queryRunner.delete('score_group', { 'name': 'Execution', 'type': 'E', 'judges': 4, 'max': 10, 'min': 0 });
    await queryRunner.delete('score_group', { 'name': 'Difficulty', 'type': 'D', 'judges': 2, 'max': 5, 'min': 0 });
    await queryRunner.delete('score_group', { 'name': 'Adjustments', 'type': 'HJ', 'judges': 1, 'max': 5, 'min': 0 });
  }
}
