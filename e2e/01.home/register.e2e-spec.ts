import { browser, ExpectedConditions } from 'protractor';
import { RegisterPage } from './register.po';
import { LoginPage } from "./login.po";
import { UsersConfigPage } from "../02.configure/users/users.po";
import { UserEditorPage } from "../02.configure/users/user-editor.po";

describe('gymsystems App: Register', function() {
  let page: RegisterPage;
  let login: LoginPage;
  let userConfig: UsersConfigPage;
  let userEditor: UserEditorPage;

  beforeAll(() => {
    login = new LoginPage();
    page = new RegisterPage();
    userConfig = new UsersConfigPage();
    userEditor = new UserEditorPage();

    page.navigateTo();
  });


  describe('deny registration', () => {
    beforeEach(() => browser.ignoreSynchronization = true);
    afterEach(() => browser.ignoreSynchronization = false);
    it('when missing fields', () => {
      page.enterData('test', false, null, null, null, null);
      expect(page.registerButton.isEnabled()).toBeFalsy();
    });

    it('when email is incorrect', () => {
      page.enterData('test', false, 'test', 'Turn', 'test', 'test');
      expect(page.registerButton.isEnabled()).toBeFalsy();
    });

    it('when passwords do not match', () => {
      page.enterData('test', false, 'test@test.no', 'Turn', 'test', 'testing');
      expect(page.registerButton.isEnabled()).toBeFalsy();
    });

    it('when user allready exists', () => {
      page.enterData('admin', false, 'test@test.no', 'Turn', 'test', 'test');
      expect(page.registerButton.isEnabled()).toBeTruthy();

      page.registerButton.click();
      browser.wait(ExpectedConditions.visibilityOf(page.error), 1000);
      expect<any>(page.error.getText()).toEqual('403 - Forbidden: A user with this name allready exists');

      page.dismissError();
      page.navigateTo();
    });
  });

  describe('allow registration', () => {
    beforeEach(() => browser.ignoreSynchronization = true);
    afterEach(() => browser.ignoreSynchronization = false);
    it('when all is correct', () => {
      page.enterData('organizer', true, 'organizer@thisemailadressdoesnotexist.no', 'Fictional club', 'test', 'test');
      expect(page.registerButton.isEnabled()).toBeTruthy();
      browser.wait(ExpectedConditions.textToBePresentInElementValue(page.club, 'FICTIONAL CLUB'), 1000);

      page.registerButton.click();
      browser.wait(ExpectedConditions.visibilityOf(page.error), 1000);
      expect<any>(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/');
      expect<any>(page.error.getText()).toEqual(`You are registerred! We've sent you an email with your credentials.`);
    });
  });

  describe('newly created user', () => {
    beforeEach(() => browser.ignoreSynchronization = true);
    afterEach(() => browser.ignoreSynchronization = false);
    it ('should be able to log in', () => {
      login.navigateTo();
      login.login('organizer', 'test');
      browser.wait(ExpectedConditions.visibilityOf(login.userInfo), 1000);
      expect<any>(login.userInfo.getText()).toBe('organizer');
    });

    it('should be able to log out', () => {
      page.logoutButton.click();
      browser.wait(ExpectedConditions.visibilityOf(page.error), 1000);

      expect<any>(page.error.getText()).toEqual('Logged out');
      expect<any>(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/');
    });
  });

  // Cleanup
  describe('can be removed', () => {
    beforeEach(() => browser.ignoreSynchronization = true);
    afterEach(() => browser.ignoreSynchronization = false);
    it('by admin', () => {
      // Clean up. Log in as admin,
      login.navigateTo();
      login.login('admin', 'admin');
      browser.wait(ExpectedConditions.visibilityOf(login.userInfo), 1000);

      // and remove organizer user
      userConfig.navigateTo();
      browser.wait(ExpectedConditions.visibilityOf(userConfig.rows), 1000);
      expect<any>(userConfig.rowCount).toBe(2);
      userConfig.getRowByUsername('organizer').click();

      browser.wait(ExpectedConditions.visibilityOf(userEditor.deleteButton), 1000);
      userEditor.deleteButton.click();
      browser.wait(ExpectedConditions.visibilityOf(userConfig.rows), 1000);
      expect<any>(userConfig.rowCount).toBe(1);

      // - logout
      login.logout();
    });
  });
});
