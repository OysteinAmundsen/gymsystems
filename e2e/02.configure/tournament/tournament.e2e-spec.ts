import { browser, ExpectedConditions } from 'protractor';
import { ConfigureTournaments } from './tournaments.po';
import { LoginPage } from '../../01.home/login.po';
import { RegisterPage } from '../../01.home/register.po';
import { Configure } from '../configure.po';
import { ConfigureUsers } from '../users/users.po';

describe('GYMSYSTEMS: Configure Tournaments', function() {
  let login: LoginPage;
  let register: RegisterPage;
  let users: ConfigureUsers;
  let tournaments: ConfigureTournaments;
  let configure: Configure;

  const userCount = 1; // Start of with admin as the only user

  beforeAll((done: any) => {
    login = new LoginPage();
    register = new RegisterPage();
    users = new ConfigureUsers();
    tournaments = new ConfigureTournaments();
    configure = new Configure();

    // console.log('** Setup 'tournament.e2e'...');
    const callback = (err?: any) => {
      if (!err) { browser.waitForAngularEnabled(true); }
      // console.log('** Setup 'tournament.e2e' complete!');
      done(err);
    };
    users.setUp().then(callback).catch(callback);
  });
  afterAll((done: any) => {
    // console.log('** Teardown 'tournament.e2e'...');
    const callback = (err?: any) => {
      browser.waitForAngularEnabled(false);
      // console.log('** Teardown 'tournament.e2e' complete!');
      done(err);
    };
    users.tearDown().then(callback).catch(callback);
  });


  it('should redirect to login when not authenticated', () => {
    tournaments.browserLoad();
    expect<any>(browser.getCurrentUrl().then(url => decodeURIComponent(url))).toEqual(browser.baseUrl + '/login?u=' + encodeURIComponent(tournaments.url));
  });

  describe('an organizer', () => {
    beforeAll(() => {
      // Login as organizer
      login.browserLoad();
      login.login('organizer', 'test');
      browser.wait(ExpectedConditions.visibilityOf(login.userInfo), 5000, 'User info did not show');
      expect<any>(login.userInfo.getText()).toEqual('organizer', 'User info displays incorrectly');

      tournaments.navigateTo();
    });
    afterAll(() => {
      login.logout();
    });

    it('should be able to create tournaments', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to edit tournaments', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to see divisions', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to edit divisions', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to see disciplines', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to edit disciplines', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to edit score system in discipline', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to see teams', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to add teams', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to edit own teams', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to see schedule', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to calculate schedule based on teams', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to remove team in discipline from schedule', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to see info', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to edit info', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to remove own teams', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should not be able to remove other clubs teams', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
  });

  describe('a club', () => {
    beforeAll(() => {
      // Login as club representative
      login.browserLoad();
      login.login('club1', 'test');
      browser.wait(ExpectedConditions.visibilityOf(login.userInfo), 5000, 'User info did not show');
      expect<any>(login.userInfo.getText()).toEqual('club1', 'User info displays incorrectly');

      tournaments.navigateTo();
    });
    afterAll(() => {
      login.logout();
    });
    it('should not be able to create tournaments', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should not be able to see divisions', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should not be able to see disciplines', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to see teams', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to add teams', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to edit own teams', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should not be able to see schedule', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should not be able to see info', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
  });

  describe('as admin', () => {
    beforeAll(() => {
      // Login as organizer
      login.browserLoad();
      login.loginAdmin();
      browser.wait(ExpectedConditions.visibilityOf(login.userInfo), 5000, 'User info did not show');
      expect<any>(login.userInfo.getText()).toEqual('admin', 'User info displays incorrectly');

      tournaments.navigateTo();
    });
    afterAll(() => {
      login.logout();
    });

    it('should be able to create tournaments', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to edit tournaments', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to see divisions', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to edit divisions', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to see disciplines', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to edit disciplines', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to edit score system in discipline', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to see teams', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to add teams', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to edit own teams', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to see schedule', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to calculate schedule based on teams', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to remove team in discipline from schedule', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to see info', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to edit info', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should be able to remove own teams', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
    it('should not be able to remove other clubs teams', () => {
      // TODO: Fill in logic
      expect<any>(true).toBeTruthy();
    });
  });
});
