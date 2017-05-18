import { browser, ExpectedConditions } from 'protractor';
import { LoginPage } from './pages/login.po';

describe('gymsystems App', function() {
  let page: LoginPage;

  beforeAll(() => {
    page = new LoginPage();
    page.navigateTo();
  });

  describe('when not logged in', () => {
    it('should deny login if you use wrong credentials', () => {
      page.login('test', 'test');
      expect<any>(browser.getCurrentUrl()).toEqual(browser.baseUrl + page.url);
      expect<any>(page.error.getText()).not.toEqual('');

      page.dismissError();
      expect<any>(page.error.getText()).toEqual('');
    });

    it('should accept login if you use correct credentials', () => {
      page.login('admin', 'admin');
      expect<any>(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/');
    });
  });

  describe('when logged in', () => {
    it('should be able to logout user', () => {
      page.logout();
      expect<any>(page.error.getText()).not.toEqual('');
      expect<any>(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/');
    })
  });
});
