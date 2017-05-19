import { browser, ExpectedConditions } from 'protractor';
import { UsersConfigPage } from "./users.po";
import { UserEditorPage } from "./user-editor.po";

describe('gymsystems App: Configure users', function() {
  let listPage: UsersConfigPage;
  let editor: UserEditorPage;

  beforeAll(() => {
    listPage = new UsersConfigPage();
    editor = new UserEditorPage();
    listPage.navigateTo();
  });

  describe('when not logged in', () => {
    it('should redirect to login', () => {
      expect<any>(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/login?u=' + encodeURIComponent(listPage.url));
    });
  });
});
