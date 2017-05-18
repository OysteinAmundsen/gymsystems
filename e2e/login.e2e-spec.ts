import { browser, ExpectedConditions } from 'protractor';
import { LoginPage } from './pages/login.po';

describe('gymsystems App: Login', function() {
  let page: LoginPage;

  beforeAll(() => {
    page = new LoginPage();
    page.navigateTo();
  });

  function getUrl() {
    return browser.getCurrentUrl().then(url => {
      return url.indexOf('?') > -1 ? url.substring(0, url.indexOf('?')) : url;
    });
  }

  describe('when not logged in', () => {
    describe('', () => {
      beforeEach(() => browser.ignoreSynchronization = true);
      afterEach(() => browser.ignoreSynchronization = false);
      it('should deny login if you use wrong credentials', () => {
        page.login('test', 'test');
        browser.wait(ExpectedConditions.visibilityOf(page.error), 1000);

        expect<any>(getUrl()).toEqual(browser.baseUrl + '/login');
        expect<any>(page.error.getText()).not.toEqual('');

        page.dismissError();
        expect<any>(page.error.getText()).toEqual('');
      });
    });

    it('should accept login if you use correct credentials', () => {
      page.login('admin', 'admin');
      expect<any>(getUrl()).toEqual(browser.baseUrl + '/');
    });
  });

  describe('when logged in', () => {
    beforeEach(() => browser.ignoreSynchronization = true);
    afterEach(() => browser.ignoreSynchronization = false);
    it('should be able to logout user', () => {
      page.logout();
      browser.wait(ExpectedConditions.visibilityOf(page.error), 1000);

      expect<any>(page.error.getText()).not.toEqual('');
      expect<any>(getUrl()).toEqual(browser.baseUrl + '/');
    });
  });
});
