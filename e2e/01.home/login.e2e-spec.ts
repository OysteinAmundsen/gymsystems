import { browser, ExpectedConditions } from 'protractor';
import { LoginPage } from './login.po';

describe('GYMSYSTEMS: Login', function() {
  let login: LoginPage;

  beforeAll(() => {
    login = new LoginPage();
    login.browserLoad();
  });

  beforeEach(() => {
    browser.waitForAngularEnabled(true);
  });
  afterEach(() => browser.waitForAngularEnabled(false));

  function getUrl() {
    return browser.getCurrentUrl().then(url => {
      return url.indexOf('?') > -1 ? url.substring(0, url.indexOf('?')) : url;
    });
  }

  it('should deny login if you use wrong credentials', () => {
    login.login('test', 'test');
    browser.wait(ExpectedConditions.visibilityOf(login.error), 1000);

    expect<any>(login.error.getText()).toEqual('Wrong username or password');
    login.dismissError();

    expect<any>(getUrl()).toEqual(browser.baseUrl + '/login');
  });

  it('should accept login if you use correct credentials', () => {
    login.loginAdmin();

    // Cleanup
    login.logout();
  });
});
