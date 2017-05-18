import { browser, element, by } from 'protractor';
import { AppRootPage } from "./app.po";

export class LoginPage extends AppRootPage {

  url: string = '/login';
  get username() { return element(by.css('app-login input[formcontrolname="username"]')); }
  get password() { return element(by.css('app-login input[formcontrolname="password"]')); }
  get loginButton() { return element(by.css('app-login footer button[type="submit"]')); }

  // Menu
  navigateTo() {
    return browser.get(this.url);
  }

  login(username, password) {
    this.username.clear();
    this.username.sendKeys(username);

    this.password.clear();
    this.password.sendKeys(password);

    this.loginButton.click();
  }
}
