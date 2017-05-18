import { browser, ExpectedConditions } from 'protractor';
import { RegisterPage } from './pages/register.po';

describe('gymsystems App: Register', function() {
  let page: RegisterPage;

  beforeAll(() => {
    page = new RegisterPage();
    page.navigateTo();
  });

  describe('deny registration', () => {
    it('when missing fields', () => {
      page.enterData('test', false, null, null, null, null);
      expect(page.registerButton.isEnabled()).toBeFalsy();
    });

    it('when email is incorrect', () => {
      page.enterData('test', false, 'test', 'Turn', 'test', 'test');
      expect(page.registerButton.isEnabled()).toBeFalsy();
    });

    it('when passwords do not match', () => {
      page.enterData('test', false, 'test@test.no', 'Turn', 'test', 'testing');
      expect(page.registerButton.isEnabled()).toBeFalsy();
    });
  })

  describe('allow registration', () => {
    it('when all is correct', () => {
      page.enterData('test', false, 'test@test.no', 'Turn', 'test', 'test');
      expect(page.registerButton.isEnabled()).toBeTruthy();
    });
  });
});
