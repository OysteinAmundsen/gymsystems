import { MigrationInterface, QueryRunner, Connection, EntityManager } from "typeorm";

export class FirstReleaseChanges1487003618914 implements MigrationInterface {

  async up(queryRunner: QueryRunner, connection: Connection, entityManager?: EntityManager): Promise<any> {
    await queryRunner.insert('division', { 'name': 'Kvinner' });
    await queryRunner.insert('division', { 'name': 'Herrer' });
    await queryRunner.insert('division', { 'name': 'Mix' });

    await queryRunner.insert('age_class', { 'name': 'Rekrutt' });
    await queryRunner.insert('age_class', { 'name': 'Junior' });
    await queryRunner.insert('age_class', { 'name': 'Senior' });

    await this.insertDiscipline(queryRunner, 'Frittstående');
    await this.insertDiscipline(queryRunner, 'Tumbling');
    await this.insertDiscipline(queryRunner, 'Trampett');
  }

  insertDiscipline(queryRunner: QueryRunner, name: string) {
    return queryRunner.insert('discipline', { 'name': name }).then(async () => {
      console.log(`Running query: SELECT id FROM discipline where name = '${name}'`);
      await queryRunner.query(`SELECT id FROM discipline where name = '${name}'`).then(async (result) => {
        const id = result[0].id;
        console.log(`Inserting scoreGroups for discipline id`, id);
        await queryRunner.insert('score_group', { 'name': 'Composition', 'discipline': id, 'type': 'C', 'operation': 1, 'judges': 2, 'max': 5, 'min': 0 });
        await queryRunner.insert('score_group', { 'name': 'Execution', 'discipline': id, 'type': 'E', 'operation': 1, 'judges': 4, 'max': 10, 'min': 0 });
        await queryRunner.insert('score_group', { 'name': 'Difficulty', 'discipline': id, 'type': 'D', 'operation': 1, 'judges': 2, 'max': 5, 'min': 0 });
        await queryRunner.insert('score_group', { 'name': 'Adjustments', 'discipline': id, 'type': 'HJ', 'operation': 2, 'judges': 1, 'max': 5, 'min': 0 });
      });
    });
  }

  async down(queryRunner: QueryRunner, connection: Connection, entityManager?: EntityManager): Promise<any> {
    await queryRunner.delete('division', { 'name': 'Kvinner' });
    await queryRunner.delete('division', { 'name': 'Herrer' });
    await queryRunner.delete('division', { 'name': 'Mix' });

    await queryRunner.delete('age_class', { 'name': 'Rekrutt' });
    await queryRunner.delete('age_class', { 'name': 'Junior' });
    await queryRunner.delete('age_class', { 'name': 'Senior' });

    await queryRunner.delete('discipline', { 'name': 'Frittstående' });
    await queryRunner.delete('discipline', { 'name': 'Tumbling' });
    await queryRunner.delete('discipline', { 'name': 'Trampett' });

    await queryRunner.delete('score_group', { 'name': 'Composition' });
    await queryRunner.delete('score_group', { 'name': 'Execution' });
    await queryRunner.delete('score_group', { 'name': 'Difficulty' });
    await queryRunner.delete('score_group', { 'name': 'Adjustments' });
  }
}
