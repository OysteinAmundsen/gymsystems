import { Gymsystems2Page } from './app.po';

describe('gymsystems2 App', function() {
  let page: Gymsystems2Page;

  beforeEach(() => {
    page = new Gymsystems2Page();
  })

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('gymsystems2 works!');
  });
});
