import { browser, element, by, ExpectedConditions } from 'protractor';
import { AppRootPage } from "../app.po";

export class LoginPage extends AppRootPage {

  url: string = '/login';
  get username() { return element(by.css('app-login input[formcontrolname="username"]')); }
  get password() { return element(by.css('app-login input[formcontrolname="password"]')); }
  get loginButton() { return element(by.css('app-login .login footer button[type="submit"]')); }
  get registerButton() { return element(by.css('app-login .register footer a[href="/register"]')); }

  // Menu
  browserLoad() {
    return browser.get(this.url);
  }

  navigateTo() {
    this.goToLogin();
    browser.wait(ExpectedConditions.visibilityOf(this.username), 5000, 'Login dialog did not display');
  }

  login(username, password) {
    this.username.clear();
    this.username.sendKeys(username);

    this.password.clear();
    this.password.sendKeys(password);

    this.loginButton.click();
  }

  loginAdmin() {
    this.navigateTo();
    this.login('admin', 'admin');
    browser.wait(ExpectedConditions.visibilityOf(this.userInfo), 5000, 'User info did not show');
    expect<any>(this.userInfo.getText()).toEqual('admin', 'User info displays incorrectly');
  }
}
