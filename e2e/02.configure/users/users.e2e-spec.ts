import { browser, ExpectedConditions } from 'protractor';
import { ConfigureUsers } from './users.po';
import { UserEditor } from './user-editor.po';
import { LoginPage } from '../../01.home/login.po';
import { RegisterPage } from '../../01.home/register.po';

describe('gymsystems: Configure users', function() {
  let users: ConfigureUsers;
  let userEditor: UserEditor;
  let login: LoginPage;
  let register: RegisterPage;

  beforeAll((done) => {
    users = new ConfigureUsers();
    userEditor = new UserEditor();
    login = new LoginPage();
    register = new RegisterPage();

    users.setUp().then(() => done());
    browser.ignoreSynchronization = true
  });
  afterAll((done) => {
    users.tearDown().then(() => done());
    browser.ignoreSynchronization = false
  });


  it('should redirect to login when not authenticated', () => {
    users.browserLoad();
    expect<any>(browser.getCurrentUrl().then(url => decodeURIComponent(url))).toEqual(browser.baseUrl + '/login?u=' + encodeURIComponent(users.url));
  });

  it('should redirect home if logged in as unprivileged user', () => {
    // Log in as club1
    login.browserLoad();
    login.login('club1', 'test');
    browser.wait(ExpectedConditions.visibilityOf(login.userInfo), 1000, 'User info did not show');
    expect<any>(login.userInfo.getText()).toBe('club1', 'User info did not display club1 user');

    users.navigateTo();
    expect<any>(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/', 'should be redirected home for any url you do not have the privileges to see.');

    login.logout();
  });


  describe('as organizer', () => {
    beforeAll(() => {
      login.browserLoad();
      login.login('organizer', 'test');
      browser.wait(ExpectedConditions.visibilityOf(login.userInfo), 1000, 'User info did not display organizer');
      expect<any>(login.userInfo.getText()).toBe('organizer');

      // Go to configure/users
      users.navigateTo();
    });
    afterAll(() => {
      login.logout();
    });

    it('should display a list of registerred users', () => {
      browser.wait(ExpectedConditions.visibilityOf(users.dataRows), 1000, 'User grid did not show');
      expect<any>(users.rowCount).toBe(2, 'Should only see users connected to the same club');
    });

    it('should not be able to remove itself', () => {
      users.getRowByUsername('organizer').click();
      browser.wait(ExpectedConditions.visibilityOf(userEditor.username), 1000, 'Editor did not appear');
      expect<any>(userEditor.deleteButton.isPresent()).toBeFalsy('Delete button should be disabled');

      // Click cancel
      userEditor.cancelButton.click();
      browser.wait(ExpectedConditions.visibilityOf(users.dataRows), 1000, 'User grid did not show');
    });

    it('should not be able to elevate users to a highter privilege than itself', () => {
      // TODO
      expect<any>(true).toBeTruthy();
    })

    it('should be able to remove users in same club', () => {
      // Remove user
      users.removeUser('club1');
      expect<any>(users.rowCount).toBe(1);
    });

    it('should be able to create users', () => {
      // TODO
      expect<any>(true).toBeTruthy();
    })
  });



  describe('as admin', () => {
    beforeAll(() => {
      login.browserLoad();
      login.loginAdmin();
      users.navigateTo();
    });
    afterAll(() => {
      login.logout();
    });

    it('should display a list of registerred users', () => {
      browser.wait(ExpectedConditions.visibilityOf(users.dataRows), 1000);
      expect<any>(users.rowCount).toBe(3, 'Should see all users in the system');
    });

    it('should be able to remove the users just created', () => {
      users.removeUser('organizer');
      users.removeUser('club2');
      expect<any>(users.rowCount).toBe(1, 'Only admin user left in the system');
    });
  });
});
