import { GymsystemsPage } from './app.po';

describe('gymsystems App', function() {
  let page: GymsystemsPage;

  beforeEach(() => {
    page = new GymsystemsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
