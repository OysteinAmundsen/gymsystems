import { browser, element, by, ExpectedConditions } from 'protractor';
import { ConnectionOptions, createConnection, getConnectionManager, QueryRunner } from 'typeorm';
import { AppRootPage } from "../../app.po";
import { Configure } from "../configure.po";
import { DivisionType } from "../../../server/model/Division";

export class DivisionEditor extends AppRootPage {

  setUp(queryRunner?: QueryRunner) {
    if (queryRunner) { this._queryRunner = queryRunner; }
    return new Promise((resolve, reject) => {
      this.queryRunner.then(queryRunner => {
        [
          { type: DivisionType.Gender, name: 'Kvinner', sortOrder: 1 },
          { type: DivisionType.Gender, name: 'Herrer',  sortOrder: 2 },
          { type: DivisionType.Gender, name: 'Mix',     sortOrder: 0 },
          { type: DivisionType.Age,    name: 'Rekrutt', sortOrder: 0 },
          { type: DivisionType.Age,    name: 'Junior',  sortOrder: 1 },
          { type: DivisionType.Age,    name: 'Senior',  sortOrder: 2 }
        ]
      });
    });
  }

  tearDown(queryRunner?: QueryRunner) {
    if (queryRunner) { this._queryRunner = queryRunner; }
    return new Promise((resolve, reject) => {
      this.queryRunner.then(queryRunner => {
      });
    });
  }
}
