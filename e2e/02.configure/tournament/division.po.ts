import { browser, element, by, ExpectedConditions } from 'protractor';
import { ConnectionOptions, createConnection, getConnectionManager } from 'typeorm';
import { AppRootPage } from "../../app.po";
import { Configure } from "../configure.po";
import { DivisionType } from "../../../server/model/Division";

export class DivisionEditor extends AppRootPage {

  setUp() {
    return new Promise((resolve, reject) => {
      getConnectionManager().get().driver.createQueryRunner().then(queryRunner => {
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

  tearDown() {
    return new Promise((resolve, reject) => {
      getConnectionManager().get().driver.createQueryRunner().then(queryRunner => {
      });
    });
  }
}
