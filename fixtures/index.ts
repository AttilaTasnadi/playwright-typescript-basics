// fixtures/index.ts
import { test as base, Page } from '@playwright/test';
import { BasePage } from '../pages/base.page';
import { PageHelper } from '../helpers/page.helper';
import { Logger } from '../helpers/logger';

type OpenFn = <T extends BasePage>(PageClass: new (page: Page) => T) => Promise<T>;

export const test = base.extend<{ open: OpenFn; pageHelper: PageHelper; logger: Logger }>({
  logger: async ({}, use, testInfo) => {
    const logger = new Logger(testInfo.title);
    await use(logger);
    await testInfo.attach('test-log', { body: logger.dump(), contentType: 'text/plain' });
  },

  open: async ({ page, logger }, use) => {
    await use(async (PageClass) => {
      const pageObject = new PageClass(page);
      logger.info(`Opening ${PageClass.name}`);
      await pageObject.open();
      return pageObject;
    });
  },

  pageHelper: async ({ page }, use) => {
    await use(new PageHelper(page));
  },
});

export { expect } from '@playwright/test';