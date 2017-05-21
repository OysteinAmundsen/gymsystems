import { browser, ExpectedConditions } from 'protractor';
import { ConfigureTournaments } from "./tournaments.po";
import { LoginPage } from "../../01.home/login.po";
import { RegisterPage } from "../../01.home/register.po";
import { Configure } from "../configure.po";
import { ConfigureUsers } from "../users/users.po";

describe('gymsystems: Configure', function() {
  let login: LoginPage;
  let register: RegisterPage;
  let users: ConfigureUsers;
  let tournaments: ConfigureTournaments;
  let configure: Configure;

  const userCount = 1; // Start of with admin as the only user

  beforeAll(() => {
    login = new LoginPage();
    register = new RegisterPage();
    users = new ConfigureUsers();
    tournaments = new ConfigureTournaments();
    configure = new Configure();

    browser.ignoreSynchronization = true
  });
  afterAll(() => {
    browser.ignoreSynchronization = false
  });


  describe('an organizer', () => {
    beforeAll(() => {
      register.browserLoad();

      // Create organizer
      register.createOrganizer();
      browser.wait(ExpectedConditions.visibilityOf(register.error), 1000, 'Registration message did not show');
      register.dismissError();
    });

    it('should be able to create tournaments', () => {
      // Login as club representative
      login.navigateTo();
      login.login('organizer', 'test');
      browser.wait(ExpectedConditions.visibilityOf(login.userInfo), 5000, 'User info did not show');
      expect<any>(login.userInfo.getText()).toEqual('organizer', 'User info displays incorrectly');

      login.logout();
    });
  });

  describe('a club', () => {
    beforeAll(() => {
      register.browserLoad();

      // Create club1
      register.createClub('club1', register.OrganizerClub);
      browser.wait(ExpectedConditions.visibilityOf(register.error), 1000, 'Registration message did not show');
      register.dismissError();

      // Create club2
      register.createClub('club2', 'Another club');
      browser.wait(ExpectedConditions.visibilityOf(register.error), 1000, 'Registration message did not show');
      register.dismissError();
    });

    it('should be able to create tournaments', () => {
      // Login as club representative
      login.navigateTo();
      login.login('club1', 'test');
      browser.wait(ExpectedConditions.visibilityOf(login.userInfo), 5000, 'User info did not show');
      expect<any>(login.userInfo.getText()).toEqual('club1', 'User info displays incorrectly');

      login.logout();
    });
  });

  describe('admin', () => {
    it('can cleanup', () => {
      // Login as admin
      login.loginAdmin();

      // Go to configure/users
      users.navigateTo();

      // Remove users
      users.removeUser('organizer');
      users.removeUser('club1');
      users.removeUser('club2');
      expect<any>(users.rowCount).toBe(1, 'Only admin user left in the system');

      // Logout
      login.logout();
    })
  });
});
