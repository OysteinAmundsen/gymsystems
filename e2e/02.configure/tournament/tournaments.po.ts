import { browser, element, by, ExpectedConditions } from 'protractor';
import { AppRootPage } from "../../app.po";
import { ConnectionOptions, createConnection, getConnectionManager } from 'typeorm';
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
    return getConnectionManager().get().driver.createQueryRunner().then(queryRunner => {
      return Promise.all([
        queryRunner.insert('tournament', { })
      ]).then(() => {
        console.log('** Setup complete!');
      });
    });
  }

  tearDown() {
    return getConnectionManager().get().driver.createQueryRunner().then(queryRunner => {
      return Promise.all([
        queryRunner.delete('tournament', {name: 'organizer'}),
      ]).then(() => {
        console.log('** Tear down complete!');
      });
    });
  }
}
