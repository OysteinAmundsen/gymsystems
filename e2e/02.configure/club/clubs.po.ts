import { browser, element, by, ExpectedConditions } from 'protractor';
import { ConnectionOptions, createConnection, getConnectionManager, QueryRunner } from 'typeorm';
import * as chalk from 'chalk';

import { AppRootPage } from '../../app.po';
import { Configure } from '../configure.po';

export class ConfigureClubs extends AppRootPage {

  setUp(queryRunner?: QueryRunner) {
    if (queryRunner) { this._queryRunner = queryRunner; }

    return new Promise((resolve, reject) => {
      this.queryRunner.then(qr => {
        // console.log(chalk.yellow('  - clubs.po: Create clubs'));
        Promise.all([
          qr.insert('club', {id: 1, name: 'FICTIONAL CLUB'}),
          qr.insert('club', {id: 2, name: 'ANOTHER CLUB'}),
          qr.insert('club', {id: 3, name: 'YET ANOTHER CLUB'}),
        ]).then(() => resolve())
          .catch(err => { console.log(err); reject(err); });
      }).catch(err => { console.log(err); reject(err); });
    });
  }

  tearDown(queryRunner?: QueryRunner) {
    if (queryRunner) { this._queryRunner = queryRunner; }
    return new Promise((resolve, reject) => {
      this.queryRunner.then(qr => {
        // console.log(chalk.yellow('  - clubs.po: Remove clubs'));
        qr.query('delete from club where id > 0')
          .then(() => resolve())
          .catch(err => { console.log(err); reject(err); });
      }).catch(err => { console.log(err); reject(err); });
    });
  }
}
