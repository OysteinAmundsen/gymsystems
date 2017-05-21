import { browser, element, by, ExpectedConditions } from 'protractor';
import { AppRootPage } from '../app.po';

export class Configure extends AppRootPage {
  url = '/configure';
  // Contents

  get menu() { return element(by.css('app-configure > menu')); }
  get menuItems() { return element.all(by.css('app-configure > menu li a')); }
  get tournaments() { return element(by.css('app-configure > menu li a[routerlink="./tournament"]')); }
  get users() { return element(by.css('app-configure > menu li a[routerlink="./users"]')); }
  get display() { return element(by.css('app-configure > menu li a[routerlink="./display"]')); }
  get advanced() { return element(by.css('app-configure > menu li a[routerlink="./advanced"]')); }

  browserLoad() {
    return browser.get(this.url);
  }

  navigateTo() {
    this.goToConfigure();
    browser.wait(ExpectedConditions.visibilityOf(this.menu), 5000, 'Configuration menu did not display');
  }

}
