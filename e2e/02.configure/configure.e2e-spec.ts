import { browser, ExpectedConditions } from 'protractor';
import { LoginPage } from "../01.home/login.po";
import { RegisterPage } from "../01.home/register.po";
import { ConfigureUsers } from "./users/users.po";
import { Configure } from "./configure.po";

describe('gymsystems: Configure', function() {
  let login: LoginPage;
  let register: RegisterPage;
  let users: ConfigureUsers;
  let configure: Configure;

  let userCount = 1; // Start of with admin as the only user

  beforeAll(() => {
    login = new LoginPage();
    register = new RegisterPage();
    users = new ConfigureUsers();
    configure = new Configure();

    browser.ignoreSynchronization = true
  });
  afterAll(() => {
    browser.ignoreSynchronization = false
  });


  describe('menu visible to', () => {
    beforeAll(() => {
      register.browserLoad();

      // Create club1
      register.createClub('club1', register.OrganizerClub);
      browser.wait(ExpectedConditions.visibilityOf(register.error), 1000, 'Registration message did not show');
      register.dismissError();

      // Create organizer
      register.createOrganizer();
      browser.wait(ExpectedConditions.visibilityOf(register.error), 1000, 'Registration message did not show');
      register.dismissError();
    });

    it('club should only see tournaments menu', () => {
      // Login as club representative
      login.navigateTo();
      login.login('club1', 'test');
      browser.wait(ExpectedConditions.visibilityOf(login.userInfo), 5000, 'User info did not show');
      expect<any>(login.userInfo.getText()).toEqual('club1', 'User info displays incorrectly');

      configure.navigateTo();
      expect<any>(configure.menuItems.count()).toBe(2); // Including logout
      login.logout();
    });
    it('organizer should see tournaments and users menu', () => {
      // Login as club representative
      login.navigateTo();
      login.login('organizer', 'test');
      browser.wait(ExpectedConditions.visibilityOf(login.userInfo), 5000, 'User info did not show');
      expect<any>(login.userInfo.getText()).toEqual('organizer', 'User info displays incorrectly');

      configure.navigateTo();
      expect<any>(configure.menuItems.count()).toBe(3); // Including logout
      login.logout();
    });

    it('can cleanup as admin', () => {
      // Login as admin
      login.loginAdmin();

      // Go to configure/users
      users.navigateTo();

      // Remove users
      users.removeUser('organizer');
      users.removeUser('club1');
      expect<any>(users.rowCount).toBe(1, 'Only admin user left in the system');

      // Logout
      login.logout();
    })
  });
});
