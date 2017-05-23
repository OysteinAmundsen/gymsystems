import { browser, element, by, ExpectedConditions } from 'protractor';
import { ConnectionOptions, createConnection, getConnectionManager } from 'typeorm';
import { AppRootPage } from "../../app.po";
import { Configure } from "../configure.po";

export class DisciplineEditor extends AppRootPage {

  setUp() {
    return new Promise((resolve, reject) => {
      getConnectionManager().get().driver.createQueryRunner().then(queryRunner => {
      });
    });
  }

  tearDown() {
    return new Promise((resolve, reject) => {
      getConnectionManager().get().driver.createQueryRunner().then(queryRunner => {
      });
    });
  }
}
