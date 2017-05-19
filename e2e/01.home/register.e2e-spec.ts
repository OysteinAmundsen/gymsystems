import { browser, ExpectedConditions } from 'protractor';
import { RegisterPage } from './register.po';
import { LoginPage } from "./login.po";
import { ConfigureUsers } from "../02.configure/users/users.po";
import { UserEditor } from "../02.configure/users/user-editor.po";

describe('gymsystems: Register', function() {
  let register: RegisterPage;
  let login: LoginPage;
  let users: ConfigureUsers;

  beforeAll(() => {
    login = new LoginPage();
    register = new RegisterPage();
    users = new ConfigureUsers();

    register.navigateTo();
  });
  afterAll(() => {
    // Log in admin
    login.loginAdmin();

    // Go to configure/users
    this.navigateTo();
    browser.wait(ExpectedConditions.visibilityOf(this.rows), 1000);
    expect<any>(this.rowCount).toBe(2);

    // Remove user
    users.removeUser('organizer');
    expect<any>(this.rowCount).toBe(1);

    // Logout admin
    login.logout();
  });

  beforeEach(() => browser.ignoreSynchronization = true);
  afterEach(() => browser.ignoreSynchronization = false);

  describe('deny registration', () => {
    it('when missing fields', () => {
      register.enterData('test', false, null, null, null, null);
      expect(register.registerButton.isEnabled()).toBeFalsy();
    });

    it('when email is incorrect', () => {
      register.enterData('test', false, 'test', 'Turn', 'test', 'test');
      expect(register.registerButton.isEnabled()).toBeFalsy();
    });

    it('when passwords do not match', () => {
      register.enterData('test', false, 'test@test.no', 'Turn', 'test', 'testing');
      expect(register.registerButton.isEnabled()).toBeFalsy();
    });

    it('when user allready exists', () => {
      register.enterData('admin', false, 'test@test.no', 'Turn', 'test', 'test');
      expect(register.registerButton.isEnabled()).toBeTruthy();

      register.registerButton.click();
      browser.wait(ExpectedConditions.visibilityOf(register.error), 1000);
      expect<any>(register.error.getText()).toEqual('403 - Forbidden: A user with this name allready exists');

      register.dismissError();
      register.navigateTo();
    });
  });

  describe('allow registration', () => {
    it('when all is correct', () => {
      register.createOrganizer();
    });
  });

  describe('newly created user', () => {
    it ('should be able to log in', () => {
      login.navigateTo();
      login.login('organizer', 'test');
      browser.wait(ExpectedConditions.visibilityOf(login.userInfo), 1000);
      expect<any>(login.userInfo.getText()).toBe('organizer');
    });

    it('should be able to log out', () => {
      register.logout();
      browser.wait(ExpectedConditions.visibilityOf(register.error), 1000);

      expect<any>(register.error.getText()).toEqual('Logged out');
      expect<any>(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/');
    });
  });
});
