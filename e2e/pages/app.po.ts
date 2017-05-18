import { browser, element, by } from 'protractor';

export class AppRootPage {

  // Menu
  get loginButton() { return element(by.css('app-root nav ul li a[href^="/login"]')); }
  get logoutButton() { return element(by.css('app-root .user-info a[href="/logout"]')); }
  get homeButton() { return element(by.css('app-root nav ul li a[href="/"]')); }
  get configureButton() { return element(by.css('app-root nav ul li a[href^="/configure"]')); }

  // Language
  get langNOButton() { return element(by.css('app-root footer .language-selector .flag-icon-no')); }
  get langENButton() { return element(by.css('app-root footer .language-selector .flag-icon-gb')); }

  // Contents
  get error() { return element(by.css('app-dialog aside[role="dialog"] > div > pre')); }

  goToLogin() {
    this.loginButton.click();
  }

  logout() {
    this.logoutButton.click();
  }

  goHome() {
    this.homeButton.click();
  }

  changeLanguage(lng: string) {
    this[`lang${lng.toUpperCase()}Button`].click();
  }

  dismissError() {
    element(by.css('app-dialog div[role="dialogContainer"]')).click();
  }
}
