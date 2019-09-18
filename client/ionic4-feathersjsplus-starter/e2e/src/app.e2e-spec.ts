import { AppPage } from './app.po';

describe('new App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should be blank', async () => {
    await page.navigateTo();
    expect(page.getParagraphText()).toContain('Login');
  });
});
