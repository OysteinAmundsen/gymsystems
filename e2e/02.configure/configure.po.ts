import { browser, element, by, ExpectedConditions } from 'protractor';
import { AppRootPage } from "../app.po";

export class Configure extends AppRootPage {
  url: string = '/configure';
  // Contents

  get tournaments() { return element(by.css('app-configure > menu li a[routerlink="./tournament"]')); }
  get users() { return element(by.css('app-configure > menu li a[routerlink="./users"]')); }
  get display() { return element(by.css('app-configure > menu li a[routerlink="./display"]')); }
  get advanced() { return element(by.css('app-configure > menu li a[routerlink="./advanced"]')); }

  navigateTo() {
    return browser.get(this.url);
  }
}
