import { browser, element, by, ExpectedConditions } from 'protractor';
import { ConnectionOptions, createConnection, getConnectionManager } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AppRootPage } from '../../app.po';
import { LoginPage } from '../../01.home/login.po';
import { Configure } from '../configure.po';
import { UserEditor } from './user-editor.po';
import { ConfigureClubs } from "../club/clubs.po";

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
    const clubs = new ConfigureClubs();
    return new Promise((resolve, reject) => {
      getConnectionManager().get().driver.createQueryRunner().then(queryRunner => {
        const pass = bcrypt.hashSync('test', bcrypt.genSaltSync(8));

        // Persist users in clubs
        clubs.setUp().then(() => {
          Promise.all([
            queryRunner.insert('user', { name: 'organizer',   email: 'organizer@bla.no', password: pass, role: Role.Organizer,   club: 1 }),
            queryRunner.insert('user', { name: 'secretariat', email: 'secretar@bla.no',  password: pass, role: Role.Secretariat, club: 1 }),
            queryRunner.insert('user', { name: 'club1',       email: 'club1@bla.no',     password: pass, role: Role.Club,        club: 1 }),
            queryRunner.insert('user', { name: 'club2',       email: 'club2@bla.no',     password: pass, role: Role.Club,        club: 2 }),
            queryRunner.insert('user', { name: 'club3',       email: 'club3@bla.no',     password: pass, role: Role.Club,        club: 3 })
          ]).then(() => resolve())
            .catch(err => { console.log(err); reject(); });
        }).catch(err => reject(err));
      });
    });
  }

  tearDown() {
    const clubs = new ConfigureClubs();
    return new Promise((resolve, reject) => {
      getConnectionManager().get().driver.createQueryRunner().then(queryRunner => {
        // Remove users
        Promise.all([
          queryRunner.delete('user', {name: 'organizer'}),
          queryRunner.delete('user', {name: 'secretariat'}),
          queryRunner.delete('user', {name: 'club1'}),
          queryRunner.delete('user', {name: 'club2'}),
          queryRunner.delete('user', {name: 'club3'}),
        ]).then(() => {
          clubs.tearDown()
            .then(() => resolve())
            .catch(err => { console.log(err); reject(err); });
        }).catch(err => reject(err))
      });
    });
  }
}
