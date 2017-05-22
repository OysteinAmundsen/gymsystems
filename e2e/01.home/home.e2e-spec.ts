import { browser, ExpectedConditions } from 'protractor';
import { HomePage } from './home.po';
import { LoginPage } from './login.po';

describe('gymsystems: Home', () => {
  let home: HomePage;
  let login: LoginPage;

  beforeAll(() => {
    home = new HomePage();
    login = new LoginPage();
    home.browserLoad();
  });

  describe('when working with empty system', () => {
    it('should display message saying "No tournaments"', () => {
      expect<any>(home.currentTournamentHeader).toEqual('No tournament today.');
    });

    it('should be able to change language', () => {
      // To norwegian
      home.changeLanguage('no');
      expect<any>(home.currentTournamentHeader).toEqual('Ingen turneringer idag.');

      // And back again
      home.changeLanguage('en');
      expect<any>(home.currentTournamentHeader).toEqual('No tournament today.');
    });

    it('should redirect to login page when login button is pushed', () => {
      login.navigateTo();
      expect<any>(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/login?u=%252F');
    })

    it('should redirect to home page when home button is pushed', () => {
      home.goHome();
      expect<any>(browser.getCurrentUrl()).toEqual(browser.baseUrl + home.url);
    })
  });


});
