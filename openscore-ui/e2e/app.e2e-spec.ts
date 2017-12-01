import { OpenscoreUiPage } from './app.po';

describe('openscore-ui App', () => {
  let page: OpenscoreUiPage;

  beforeEach(() => {
    page = new OpenscoreUiPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
