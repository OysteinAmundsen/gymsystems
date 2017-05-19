import { browser, ExpectedConditions } from 'protractor';
import { LoginPage } from './login.po';

describe('gymsystems: Login', function() {
  let login: LoginPage;

  beforeAll(() => {
    login = new LoginPage();
  });

  beforeEach(() => {
    browser.ignoreSynchronization = true;
    login.navigateTo();
  });
  afterEach(() => browser.ignoreSynchronization = false);

  function getUrl() {
    return browser.getCurrentUrl().then(url => {
      return url.indexOf('?') > -1 ? url.substring(0, url.indexOf('?')) : url;
    });
  }

  it('should deny login if you use wrong credentials', () => {
    login.login('test', 'test');
    browser.wait(ExpectedConditions.visibilityOf(login.error), 1000);

    expect<any>(getUrl()).toEqual(browser.baseUrl + '/login');
    expect<any>(login.error.getText()).toEqual('Wrong username or password');

    login.dismissError();
    expect<any>(login.error.getText()).toEqual('');
  });

  it('should accept login if you use correct credentials', () => {
    login.loginAdmin();

    // Cleanup
    login.logout();
    browser.wait(ExpectedConditions.visibilityOf(login.error), 1000);
    expect<any>(login.error.getText()).toEqual('Logged out');

    login.dismissError();
    expect<any>(getUrl()).toEqual(browser.baseUrl + '/');
  });
});
