import { browser, element, by } from 'protractor';
import { AppRootPage } from "../app.po";

export class HomePage extends AppRootPage {
  url: string = '/';
  // Contents
  get currentTournamentHeader() { return element(by.css('app-root app-home .main-content header h1')).getText(); }

  browserLoad() {
    return browser.get(this.url);
  }
}
