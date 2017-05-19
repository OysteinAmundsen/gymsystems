import { browser, ExpectedConditions } from 'protractor';
import { ConfigureUsers } from "./users.po";
import { UserEditor } from "./user-editor.po";
import { LoginPage } from "../../01.home/login.po";
import { RegisterPage } from "../../01.home/register.po";

describe('gymsystems: Configure users', function() {
  let users: ConfigureUsers;
  let userEditor: UserEditor;
  let login: LoginPage;
  let register: RegisterPage;

  let userCount = 1; // Start of with admin as the only user

  beforeAll(() => {
    users = new ConfigureUsers();
    userEditor = new UserEditor();
    login = new LoginPage();
    register = new RegisterPage();
    browser.ignoreSynchronization = true
  });
  afterAll(() => {
    browser.ignoreSynchronization = false
  });


  describe('when not logged in', () => {
    it('should redirect to login', () => {
      users.navigateTo();
      expect<any>(browser.getCurrentUrl().then(url => decodeURIComponent(url))).toEqual(browser.baseUrl + '/login?u=' + encodeURIComponent(users.url));
    });
  });



  describe('as club representative', () => {
    beforeAll(() => {
      // Create club1
      register.createClub('club1', register.OrganizerClub);
      browser.wait(ExpectedConditions.visibilityOf(register.error), 1000);
      userCount++;

      // Create club2
      register.createClub('club2', 'Another club');
      browser.wait(ExpectedConditions.visibilityOf(register.error), 1000);
      userCount++;
    });
    afterAll(() => {
      login.logout();
      browser.wait(ExpectedConditions.visibilityOf(register.error), 1000);
      login.dismissError();
    });

    it('should not gain access to the users panel', () => {
      // Log in as club1
      login.navigateTo();
      login.login('club1', 'test');
      browser.wait(ExpectedConditions.visibilityOf(login.userInfo), 1000);
      expect<any>(login.userInfo.getText()).toBe('club1');

      users.navigateTo();
      expect<any>(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/', 'should be redirected home for any url you do not have the privileges to see.');
    });
  });



  describe('as organizer', () => {
    beforeAll(() => {
      // Create organizer
      register.createOrganizer();
      browser.wait(ExpectedConditions.visibilityOf(register.error), 1000);
      userCount++;

      // Log in as organizer
      login.navigateTo();
      login.login('organizer', 'test');
      browser.wait(ExpectedConditions.visibilityOf(login.userInfo), 1000);
      expect<any>(login.userInfo.getText()).toBe('organizer');

      users.navigateTo();
    });
    afterAll(() => {
      login.logout();
      browser.wait(ExpectedConditions.visibilityOf(register.error), 1000);
      login.dismissError();
    });

    it('should display a list of registerred users', () => {
      // Go to configure/users
      browser.wait(ExpectedConditions.visibilityOf(users.dataRows), 1000);
      expect<any>(users.rowCount).toBe(2, 'Should only see users connected to the same club');
    });

    it('should be able to remove users in same club', () => {
      // Remove user
      users.removeUser('club1');
      expect<any>(users.rowCount).toBe(1);
      userCount--;
    });
  });



  describe('as admin', () => {
    beforeAll(() => {
      login.loginAdmin();
      // Go to configure/users
      users.navigateTo();
    });
    afterAll(() => {
      login.logout();
      browser.wait(ExpectedConditions.visibilityOf(register.error), 1000);
      login.dismissError();
    });

    it('should display a list of registerred users', () => {
      browser.wait(ExpectedConditions.visibilityOf(users.dataRows), 1000);
      expect<any>(users.rowCount).toBe(userCount, 'Should see all users in the system');
    });

    it('should be able to remove the users just created', () => {
      users.removeUser('organizer');
      users.removeUser('club2');
      expect<any>(users.rowCount).toBe(1, 'Only admin user left in the system');
    });
  });
});
