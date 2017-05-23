import { browser, element, by, ExpectedConditions } from 'protractor';
import { ConnectionOptions, createConnection, getConnectionManager } from 'typeorm';
import { AppRootPage } from "../../app.po";
import { Configure } from "../configure.po";

export class ConfigureClubs extends AppRootPage {

  setUp() {
    return new Promise((resolve, reject) => {
      getConnectionManager().get().driver.createQueryRunner().then(queryRunner => {
        Promise.all([
          queryRunner.insert('club', {id: 1, name: 'FICTIONAL CLUB'}),
          queryRunner.insert('club', {id: 2, name: 'ANOTHER CLUB'}),
          queryRunner.insert('club', {id: 3, name: 'YET ANOTHER CLUB'}),
        ]).then(() => resolve())
          .catch(err => {
            console.log(err);
            reject();
          });
      });
    });
  }

  tearDown() {
    return new Promise((resolve, reject) => {
      getConnectionManager().get().driver.createQueryRunner().then(queryRunner => {
        queryRunner.query('delete from club where id > 0')
          .then(() => resolve())
          .catch(err => {
            console.log(err);
            reject(err);
          });
      });
    });
  }
}
