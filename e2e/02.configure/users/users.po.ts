import { browser, element, by, ExpectedConditions } from 'protractor';
import { AppRootPage } from "../../app.po";
import { LoginPage } from "../../01.home/login.po";
import { UserEditor } from "./user-editor.po";

export class ConfigureUsers extends AppRootPage {
  url: string = '/configure/users';
  // Contents

  get dataRows() { return element(by.css('app-users table tbody')); }
  get rowCount() { return element.all(by.css('app-users table tbody')).count(); }

  navigateTo() {
    return browser.get(this.url);
  }

  getRowByUsername(user: string) {
    return element(by.cssContainingText('app-users table tbody tr > td.username', user));
  }

  removeUser(userName) {
    let userEditor = new UserEditor();

    // and select organizer user
    this.getRowByUsername(userName).click();
    browser.wait(ExpectedConditions.visibilityOf(userEditor.deleteButton), 1000);

    // Click delete
    userEditor.deleteButton.click();
    browser.wait(ExpectedConditions.visibilityOf(this.dataRows), 1000);
  }
}
