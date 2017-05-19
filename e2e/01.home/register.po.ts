import { browser, element, by, ExpectedConditions } from 'protractor';
import { AppRootPage } from "../app.po";
import { LoginPage } from "./login.po";

export class RegisterPage extends AppRootPage {

  url: string = '/register';
  get username() { return element(by.css('app-register input[formcontrolname="name"]')); }
  get role() { return element(by.css('app-register app-slide-toggle[formcontrolname="role"] label')); }
  get email() { return element(by.css('app-register input[formcontrolname="email"]')); }
  get club() { return element(by.css('app-register app-typeahead[formcontrolname="club"] input')); }
  get password() { return element(by.css('app-register input[formcontrolname="password"]')); }
  get repeatPassword() { return element(by.css('app-register input[formcontrolname="repeatPassword"]')); }
  get registerButton() { return element(by.css('app-register footer button[type="submit"]')); }

  // Menu
  navigateTo() {
    // super.navigateTo();
    // this.goToLogin();
    // new LoginPage().registerButton.click();
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

  registerUser(username: string, isOrganizer: boolean, club: string) {
    this.navigateTo();
    this.enterData(username, isOrganizer, 'organizer@thisemailadressdoesnotexist.no', club, 'test', 'test');
    browser.wait(ExpectedConditions.textToBePresentInElementValue(this.club, club.toUpperCase()), 1000); // Wait for typeahead to complete
    expect(this.registerButton.isEnabled()).toBeTruthy();

    this.registerButton.click();

    browser.wait(ExpectedConditions.visibilityOf(this.error), 1000);
    expect<any>(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/');
    expect<any>(this.error.getText()).toEqual(`You are registerred! We've sent you an email with your credentials.`);
  }

  OrganizerClub: string = 'Fictional Club';
  createOrganizer() {
    this.registerUser('organizer', true, this.OrganizerClub);
  }

  createClub(name: string, club: string) {
    this.registerUser(name, false, club);
  }
}
