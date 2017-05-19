import { browser } from 'protractor';
import { HomePage } from './home.po';

describe('gymsystems App', () => {
  let page: HomePage;

  beforeAll(() => {
    page = new HomePage();
    page.navigateTo();
  });

  describe('when not logged in', () => {
    it('should display message saying "No tournaments"', () => {
      expect<any>(page.currentTournamentHeader).toEqual('No tournament today.');
    });

    it('should be able to change language', () => {
      // To norwegian
      page.changeLanguage('no');
      expect<any>(page.currentTournamentHeader).toEqual('Ingen turneringer idag.');

      // And back again
      page.changeLanguage('en');
      expect<any>(page.currentTournamentHeader).toEqual('No tournament today.');
    });

    it('should redirect to login page when login button is pushed', () => {
      page.goToLogin();
      expect<any>(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/login?u=%252F');
    })

    it('should redirect to home page when home button is pushed', () => {
      page.goHome();
      expect<any>(browser.getCurrentUrl()).toEqual(browser.baseUrl + page.url);
    })
  });
});
