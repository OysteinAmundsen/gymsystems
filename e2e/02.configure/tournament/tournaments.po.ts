import { browser, element, by, ExpectedConditions } from 'protractor';
import { ConnectionOptions, createConnection, getConnectionManager, QueryRunner } from 'typeorm';
import { AppRootPage } from '../../app.po';
import { Configure } from '../configure.po';

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

  setUp(queryRunner?: QueryRunner) {
    if (queryRunner) { this._queryRunner = queryRunner; }
    return new Promise((resolve, reject) => {
      this.queryRunner.then(qr => {
        Promise.all([
          qr.insert('tournament', {}),
        ]).then(() => {
          Promise.all([
            qr.insert('user', { }),
          ]).then(() => resolve())
            .catch(err => { console.log(err); reject(); });
        }).catch(err => { console.log(err); reject(err); });
      });
    });
  }

  tearDown(queryRunner?: QueryRunner) {
    if (queryRunner) { this._queryRunner = queryRunner; }
    return new Promise((resolve, reject) => {
      this.queryRunner.then(qr => {
        Promise.all([
          qr.delete('user', {name: 'organizer'}),
        ]).then(() => {
          qr.query('delete from tournament where id > 0')
            .then(() => resolve())
            .catch(err => { console.log(err); reject(err); });
        }).catch(err => { console.log(err); reject(err); });
      });
    });
  }
}
