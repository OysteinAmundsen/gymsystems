import { browser, element, by, ExpectedConditions } from 'protractor';
import { QueryRunner, getConnectionManager } from "typeorm";
import * as chalk from 'chalk';

export class AppRootPage {
  url = '/';

  _queryRunner: QueryRunner;
  get queryRunner(): Promise<QueryRunner> {
    return new Promise((resolve, reject) => {
      if (!this._queryRunner) {
        // console.log(chalk.yellow.bold('  -- Create queryRunner'));
        getConnectionManager().get().driver.createQueryRunner()
          .then(queryRunner => {
            // console.log(chalk.yellow.bold('  -- QueryRunner created'));
            this._queryRunner = queryRunner;
            resolve(this._queryRunner);
          })
          .catch(err => reject(err));
      } else {
        resolve(this._queryRunner);
      }
    });
  }

  // Menu
  get nav() { return element(by.css('app-root nav ul li')); }
  get navHome() { return element(by.css('app-root nav ul li a[href="/"]')); }
  get navConfigure() { return element(by.css('app-root nav ul li a[href^="/configure"]')); }
  get navLogin() { return element(by.css('app-root nav ul li a[href^="/login"]')); }

  // Footer
  get userInfo() { return element(by.css('app-root .user-info > i')); }
  get navLogout() { return element(by.css('app-root .user-info a[href="/logout"]')); }

  // Language
  get langNOButton() { return element(by.css('app-root footer .language-selector .flag-icon-no')); }
  get langENButton() { return element(by.css('app-root footer .language-selector .flag-icon-gb')); }

  // Contents
  get error() { return element(by.css('app-dialog aside[role="dialog"] > div > pre')); }

  browserLoad() {
    browser.get(this.url);
  }

  navigateTo() {
    this.navHome.click();
  }

  goToLogin() {
    this.navLogin.click();
  }

  goToConfigure() {
    this.navConfigure.click();
  }

  logout() {
    this.navLogout.click();
    browser.wait(ExpectedConditions.visibilityOf(this.error), 5000, 'No logout displayed');
    expect<any>(this.error.getText()).toEqual('Logged out');

    this.dismissError();
    expect<any>(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/');
  }

  goHome() {
    this.navHome.click();
  }

  changeLanguage(lng: string) {
    this[`lang${lng.toUpperCase()}Button`].click();
  }

  dismissError() {
    element(by.css('app-dialog div[role="dialogContainer"]')).click();
    expect<any>(this.error.getText()).toEqual('');
  }
}
