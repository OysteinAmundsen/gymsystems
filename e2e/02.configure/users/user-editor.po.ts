import { browser, element, by, ExpectedConditions } from 'protractor';
import { AppRootPage } from "../../app.po";

export class UserEditor extends AppRootPage {

  url: string = '/register';
  get username() { return element(by.css('app-user-editor input[formcontrolname="name"]')); }
  get role() { return element(by.css('app-user-editor select[formcontrolname="role"]')); }
  get email() { return element(by.css('app-user-editor input[formcontrolname="email"]')); }
  get club() { return element(by.css('app-user-editor app-typeahead[formcontrolname="club"] input')); }
  get password() { return element(by.css('app-user-editor input[formcontrolname="password"]')); }
  get repeatPassword() { return element(by.css('app-user-editor input[formcontrolname="repeatPassword"]')); }
  get saveButton() { return element(by.css('app-user-editor footer button[type="submit"]')); }
  get cancelButton() { return element(by.css('app-user-editor footer button[title="Cancel"]')); }
  get deleteButton() { return element(by.css('app-user-editor footer button[title="Delete"]')); }

  // Menu
  browserLoad() {
    return browser.get(this.url);
  }

  enterData(username: string, isOrganizer: boolean, email: string, club: string, password: string, repeatPass: string) {
    if (username) {
      this.username.clear();
      this.username.sendKeys(username);
    }
    // if (isOrganizer) this.role.click();

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

  removeOrganizer() {
  }
}
