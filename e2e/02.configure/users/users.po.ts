import { browser, element, by, ExpectedConditions } from 'protractor';
import * as bcrypt from 'bcrypt';

import { AppRootPage } from '../../app.po';
import { LoginPage } from '../../01.home/login.po';
import { Configure } from '../configure.po';
import { UserEditor } from './user-editor.po';
import { ConnectionOptions, createConnection, getConnectionManager } from 'typeorm';
import { User, Role } from '../../../server/model/User';
import { Club } from "../../../server/model/Club";

export class ConfigureUsers extends AppRootPage {
  url = '/configure/users';
  // Contents

  get dataRows() { return element(by.css('app-users table tbody:first-of-type')); }
  get rowCount() { return element.all(by.css('app-users table tbody')).count(); }


  browserLoad() {
    return browser.get(this.url);
  }

  navigateTo() {
    const configure = new Configure();
    configure.navigateTo();
    configure.menuUsers.click();
    browser.wait(ExpectedConditions.visibilityOf(this.dataRows), 1000);
  }

  getRowByUsername(user: string) {
    return element(by.cssContainingText('app-users table tbody tr > td.username', user));
  }

  removeUser(userName) {
    const userEditor = new UserEditor();

    // and select organizer user
    this.getRowByUsername(userName).click();
    browser.wait(ExpectedConditions.visibilityOf(userEditor.deleteButton), 1000);

    // Click delete
    userEditor.deleteButton.click();
    browser.wait(ExpectedConditions.visibilityOf(this.dataRows), 1000);
  }

  setUp() {
    return new Promise((resolve, reject) => {
      getConnectionManager().get().driver.createQueryRunner().then(queryRunner => {
        const pass = bcrypt.hashSync('test', bcrypt.genSaltSync(8));

        // Persist clubs
        Promise.all([
          queryRunner.insert('club', {id: 1, name: 'FICTIONAL CLUB'}),
          queryRunner.insert('club', {id: 2, name: 'ANOTHER CLUB'}),
        ]).then(() => {
          // Persist users
          Promise.all([
            queryRunner.insert('user', { name: 'organizer', email: 'organizer@bla.no', password: pass, role: Role.Organizer, club: 1 }),
            queryRunner.insert('user', { name: 'club1',     email: 'club1@bla.no',     password: pass, role: Role.Club,      club: 1 }),
            queryRunner.insert('user', { name: 'club2',     email: 'club2@bla.no',     password: pass, role: Role.Club,      club: 2 })
          ]).then(() => resolve())
            .catch(err => reject(err));
        }).catch(err => reject(err));
      });
    }).catch(err => console.log(err));
  }

  tearDown() {
    return new Promise((resolve, reject) => {
      getConnectionManager().get().driver.createQueryRunner().then(queryRunner => {
        // Remove users
        Promise.all([
          queryRunner.delete('user', {name: 'organizer'}),
          queryRunner.delete('user', {name: 'club1'}),
          queryRunner.delete('user', {name: 'club2'}),
        ]).then(() => {
          queryRunner.query('delete from club where id > 0')
            .then(() => resolve())
            .catch(err => reject(err));
        }).catch(err => reject(err));
      });
    }).catch(err => console.log(err));
  }
}
