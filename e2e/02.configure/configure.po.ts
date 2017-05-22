import { browser, element, by, ExpectedConditions } from 'protractor';
import { AppRootPage } from '../app.po';

export class Configure extends AppRootPage {
  url = '/configure';
  // Contents

  get menu() { return element(by.css('app-configure > menu')); }
  get menuItems() { return element.all(by.css('app-configure > menu li a')); }
  get menuTournaments() { return element(by.css('app-configure > menu li a[routerlink="./tournament"]')); }
  get menuUsers() { return element(by.css('app-configure > menu li a[routerlink="./users"]')); }
  get menuDisplay() { return element(by.css('app-configure > menu li a[routerlink="./display"]')); }
  get menuAdvanced() { return element(by.css('app-configure > menu li a[routerlink="./advanced"]')); }

  browserLoad() {
    return browser.get(this.url);
  }

  navigateTo() {
    this.goToConfigure();
    browser.wait(ExpectedConditions.visibilityOf(this.menu), 5000, 'Configuration menu did not display');
  }

}
