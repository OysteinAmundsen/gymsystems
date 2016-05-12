export class Gymsystems2Page {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('gymsystems2-app h1')).getText();
  }
}
