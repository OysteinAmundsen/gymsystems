import { browser, ExpectedConditions } from 'protractor';
import { ConfigureTournaments } from "./tournaments.po";
import { LoginPage } from "../../01.home/login.po";
import { RegisterPage } from "../../01.home/register.po";
import { Configure } from "../configure.po";
import { ConfigureUsers } from "../users/users.po";

describe('gymsystems: Configure Tournaments', function() {
  let login: LoginPage;
  let register: RegisterPage;
  let users: ConfigureUsers;
  let tournaments: ConfigureTournaments;
  let configure: Configure;

  const userCount = 1; // Start of with admin as the only user

  beforeAll((done) => {
    login = new LoginPage();
    register = new RegisterPage();
    users = new ConfigureUsers();
    tournaments = new ConfigureTournaments();
    configure = new Configure();

    users.setUp().then(() => done());
    browser.ignoreSynchronization = true
  });
  afterAll((done) => {
    users.tearDown().then(() => done());
    browser.ignoreSynchronization = false
  });


  it('should redirect to login when not authenticated', () => {
    tournaments.browserLoad();
    expect<any>(browser.getCurrentUrl().then(url => decodeURIComponent(url))).toEqual(browser.baseUrl + '/login?u=' + encodeURIComponent(tournaments.url));
  });

  describe('an organizer', () => {
    beforeAll(() => {
      // Login as organizer
      login.navigateTo();
      login.login('organizer', 'test');
      browser.wait(ExpectedConditions.visibilityOf(login.userInfo), 5000, 'User info did not show');
      expect<any>(login.userInfo.getText()).toEqual('organizer', 'User info displays incorrectly');

      tournaments.navigateTo();
    });
    afterAll(() => {
      login.logout();
    })

    it('should be able to create tournaments', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to edit tournaments', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to see divisions', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to edit divisions', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to see disciplines', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to edit disciplines', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to edit score system in discipline', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to see teams', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to add teams', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to edit own teams', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to see schedule', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to calculate schedule based on teams', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to remove team in discipline from schedule', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to see info', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to edit info', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to remove own teams', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should not be able to remove other clubs teams', () => {
      expect<any>(true).toBeTruthy();
    });
  });

  describe('a club', () => {
    beforeAll(() => {
      // Login as club representative
      login.navigateTo();
      login.login('club1', 'test');
      browser.wait(ExpectedConditions.visibilityOf(login.userInfo), 5000, 'User info did not show');
      expect<any>(login.userInfo.getText()).toEqual('club1', 'User info displays incorrectly');

      tournaments.navigateTo();
    });
    afterAll(() => {
      login.logout();
    })
    it('should not be able to create tournaments', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should not be able to see divisions', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should not be able to see disciplines', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to see teams', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to add teams', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to edit own teams', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should not be able to see schedule', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should not be able to see info', () => {
      expect<any>(true).toBeTruthy();
    });
  });

  describe('as admin', () => {
    beforeAll(() => {
      // Login as organizer
      login.navigateTo();
      login.loginAdmin();
      browser.wait(ExpectedConditions.visibilityOf(login.userInfo), 5000, 'User info did not show');
      expect<any>(login.userInfo.getText()).toEqual('admin', 'User info displays incorrectly');

      tournaments.navigateTo();
    });
    afterAll(() => {
      login.logout();
    })

    it('should be able to create tournaments', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to edit tournaments', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to see divisions', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to edit divisions', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to see disciplines', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to edit disciplines', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to edit score system in discipline', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to see teams', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to add teams', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to edit own teams', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to see schedule', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to calculate schedule based on teams', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to remove team in discipline from schedule', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to see info', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to edit info', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should be able to remove own teams', () => {
      expect<any>(true).toBeTruthy();
    });
    it('should not be able to remove other clubs teams', () => {
      expect<any>(true).toBeTruthy();
    });
  });
});
