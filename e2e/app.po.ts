export class GymsystemsPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('gymsystems-app h1')).getText();
  }
}
