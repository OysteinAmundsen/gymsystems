import { browser, ExpectedConditions } from 'protractor';
import { LoginPage } from '../01.home/login.po';
import { RegisterPage } from '../01.home/register.po';
import { ConfigureUsers } from './users/users.po';
import { Configure } from './configure.po';

describe('gymsystems: Configure', function() {
  let login: LoginPage;
  let register: RegisterPage;
  let users: ConfigureUsers;
  let configure: Configure;

  const userCount = 1; // Start of with admin as the only user

  beforeAll((done: any) => {
    login = new LoginPage();
    register = new RegisterPage();
    users = new ConfigureUsers();
    configure = new Configure();

    // console.log('** Starting "configure.e2e" setup...');
    const callback = (err?: any) => {
      if (!err) { browser.ignoreSynchronization = true; }
      login.browserLoad();
      // console.log('** Setup "configure.e2e" complete!');
      done(err);
    }
    users.setUp().then(callback).catch(callback);
  });
  afterAll((done: any) => {
    // console.log('** Starting "configure.e2e" teardown...');
    const callback = (err?: any) => {
      browser.ignoreSynchronization = false;
      // console.log('** Teardown "configure.e2e" complete!');
      done(err);
    }
    users.tearDown().then(callback).catch(callback);
  });


  describe('as club representative', () => {
    beforeAll(() => {
      // Login as club representative
      // login.navigateTo();
      login.login('club1', 'test');
      browser.wait(ExpectedConditions.visibilityOf(login.userInfo), 5000, 'User info did not show');
      expect<any>(login.userInfo.getText()).toEqual('club1', 'User info displays incorrectly');

      configure.navigateTo();
    });
    afterAll(() => login.logout());

    it('should see tournaments menu', () => {
      expect<any>(configure.menuTournaments.isDisplayed()).toBeTruthy();
    });
    it('should not see users menu', () => {
      expect<any>(configure.menuUsers.isPresent()).toBeFalsy();
    });
    it('should not see display menu', () => {
      expect<any>(configure.menuDisplay.isPresent()).toBeFalsy();
    });
    it('should not see users menu', () => {
      expect<any>(configure.menuAdvanced.isPresent()).toBeFalsy();
    });
  });

  describe('as organizer', () => {
    beforeAll(() => {
      // Login as organizer
      login.navigateTo();
      login.login('organizer', 'test');
      browser.wait(ExpectedConditions.visibilityOf(login.userInfo), 5000, 'User info did not show');
      expect<any>(login.userInfo.getText()).toEqual('organizer', 'User info displays incorrectly');

      configure.navigateTo();
    });
    afterAll(() => login.logout());

    it('should see tournaments menu', () => {
      expect<any>(configure.menuTournaments.isDisplayed()).toBeTruthy();
    });
    it('should see users menu', () => {
      expect<any>(configure.menuUsers.isDisplayed()).toBeTruthy();
    });
    it('should not see display menu', () => {
      expect<any>(configure.menuDisplay.isPresent()).toBeFalsy();
    });
    it('should not see users menu', () => {
      expect<any>(configure.menuAdvanced.isPresent()).toBeFalsy();
    });
  });
});
