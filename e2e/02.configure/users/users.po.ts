import { browser, element, by, ExpectedConditions } from 'protractor';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

import { AppRootPage } from '../../app.po';
import { LoginPage } from '../../01.home/login.po';
import { Configure } from '../configure.po';
import { UserEditor } from './user-editor.po';
import { ConnectionOptions, createConnection, getConnectionManager } from 'typeorm';
import { User, Role } from '../../../server/model/User';

export class ConfigureUsers extends AppRootPage {
  url = '/configure/users';
  // Contents

  get dataRows() { return element(by.css('app-users table tbody')); }
  get rowCount() { return element.all(by.css('app-users table tbody')).count(); }

  browserLoad() {
    return browser.get(this.url);
  }

  navigateTo() {
    const configure = new Configure();
    configure.navigateTo();
    configure.users.click();
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
}
