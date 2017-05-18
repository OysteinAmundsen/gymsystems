import { browser, element, by } from 'protractor';
import { AppRootPage } from "./app.po";

export class RegisterPage extends AppRootPage {

  url: string = '/register';
  get username() { return element(by.css('app-register input[formcontrolname="name"]')); }
  get role() { return element(by.css('app-register app-slide-toggle[formcontrolname="role"] input')); }
  get email() { return element(by.css('app-register input[formcontrolname="email"]')); }
  get club() { return element(by.css('app-register app-typeahead[formcontrolname="club"] input')); }
  get password() { return element(by.css('app-register input[formcontrolname="password"]')); }
  get repeatPassword() { return element(by.css('app-register input[formcontrolname="repeatPassword"]')); }
  get registerButton() { return element(by.css('app-register footer button[type="submit"]')); }

  // Menu
  navigateTo() {
    return browser.get(this.url);
  }

  enterData(username: string, isOrganizer: boolean, email: string, club: string, password: string, repeatPass: string) {
    if (username) {
      this.username.clear();
      this.username.sendKeys(username);
    }
    if (isOrganizer) this.role.click();

    if (email) {
      this.email.clear();
      this.email.sendKeys(email);
    }
    if (club) {
      this.club.clear();
      this.club.sendKeys(club.toUpperCase());
    }
    if (password) {
      this.password.clear();
      this.password.sendKeys(password);
    }
    if (repeatPass) {
      this.repeatPassword.clear();
      this.repeatPassword.sendKeys(repeatPass);
    }
  }
}
