import { browser, element, by, ExpectedConditions } from 'protractor';
import { ConnectionOptions, createConnection, getConnectionManager, QueryRunner } from 'typeorm';
import { AppRootPage } from '../../app.po';
import { Configure } from '../configure.po';

export class ScoreSystemEditor extends AppRootPage {

  setUp(queryRunner?: QueryRunner) {
    if (queryRunner) { this._queryRunner = queryRunner; }
    return new Promise((resolve, reject) => {
      this.queryRunner.then(qr => {
      });
    });
  }

  tearDown(queryRunner?: QueryRunner) {
    if (queryRunner) { this._queryRunner = queryRunner; }
    return new Promise((resolve, reject) => {
      this.queryRunner.then(qr => {
      });
    });
  }
}
