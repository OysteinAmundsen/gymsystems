import { browser, element, by } from 'protractor';
import { AppRootPage } from "../../app.po";

export class UsersConfigPage extends AppRootPage {
  url: string = '/configure/users';
  // Contents

  get rows() { return element(by.css('app-users table')); }
  get rowCount() { return element.all(by.css('app-users table tbody')).count(); }

  navigateTo() {
    return browser.get(this.url);
  }

  getRowByUsername(user: string) {
    return element(by.cssContainingText('app-users table tbody tr > td.username', user));
  }
}
