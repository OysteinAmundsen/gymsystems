import { browser, ExpectedConditions } from 'protractor';
import { RegisterPage } from './register.po';
import { LoginPage } from './login.po';
import { ConfigureUsers } from '../02.configure/users/users.po';
import { UserEditor } from '../02.configure/users/user-editor.po';

describe('GYMSYSTEMS: Register', function() {
  let register: RegisterPage;
  let login: LoginPage;
  let users: ConfigureUsers;

  beforeAll(() => {
    login = new LoginPage();
    register = new RegisterPage();
    users = new ConfigureUsers();

    register.browserLoad();
    browser.waitForAngularEnabled(true);
  });
  afterAll(() => {
    browser.waitForAngularEnabled(false);
  });

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
      expect(register.registerButton.isEnabled()).toBeTruthy('Registration button is not enabled');

      register.registerButton.click();
      browser.wait(ExpectedConditions.visibilityOf(register.error), 1000);
      expect<any>(register.error.getText()).toEqual('403 - Forbidden: A user with this name allready exists');

      register.dismissError();
    });
  });

  describe('allow registration', () => {
    afterAll((done: any) => {
      // console.log('** Starting "register.e2e" teardown...');
      const callback = (err?: any) => {
        browser.waitForAngularEnabled(false);
        // console.log('** Teardown "register.e2e" complete!');
        done(err);
      };
      users.tearDown().then(callback).catch(callback);
    });
    it('when all is correct', () => {
      register.createOrganizer();
    });

    it ('should be able to log in', () => {
      login.browserLoad();
      login.login('organizer', 'test');
      browser.wait(ExpectedConditions.visibilityOf(login.userInfo), 1000);
      expect<any>(login.userInfo.getText()).toBe('organizer');
    });

    it('should be able to log out', () => {
      register.logout();
    });
  });
});
