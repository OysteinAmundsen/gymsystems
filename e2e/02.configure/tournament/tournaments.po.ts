import { browser, element, by, ExpectedConditions } from 'protractor';
import { ConnectionOptions, createConnection, getConnectionManager } from 'typeorm';
import { AppRootPage } from "../../app.po";
import { Configure } from "../configure.po";

export class ConfigureTournaments extends AppRootPage {
  url = '/configure/tournament';
  get dataTable() { return element(by.css('app-tournament table')); }
  get dataRows() { return element(by.css('app-tournament table tbody:first-of-type')); }

  browserLoad() {
    return browser.get(this.url);
  }

  navigateTo() {
    const configure = new Configure();
    configure.navigateTo();
    configure.menuTournaments.click();
    browser.wait(ExpectedConditions.visibilityOf(this.dataTable), 1000, 'Tournament does not display');
  }

  setUp() {
    return new Promise((resolve, reject) => {
      getConnectionManager().get().driver.createQueryRunner().then(queryRunner => {
        Promise.all([
          queryRunner.insert('tournament', {}),
        ]).then(() => {
          Promise.all([
            queryRunner.insert('user', { }),
          ]).then(() => resolve())
            .catch(err => { console.log(err); reject(); });
        }).catch(err => { console.log(err); reject(err); });
      });
    });
  }

  tearDown() {
    return new Promise((resolve, reject) => {
      getConnectionManager().get().driver.createQueryRunner().then(queryRunner => {
        Promise.all([
          queryRunner.delete('user', {name: 'organizer'}),
        ]).then(() => {
          queryRunner.query('delete from tournament where id > 0')
            .then(() => resolve())
            .catch(err => { console.log(err); reject(err); });
        }).catch(err => { console.log(err); reject(err); });
      });
    });
  }
}