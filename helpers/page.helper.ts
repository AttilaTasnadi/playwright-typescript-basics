import { Page, expect } from '@playwright/test';

export class PageHelper {
  constructor(private readonly page: Page) {}

  async expectTitleContains(text: string) {
    await expect(this.page).toHaveTitle(new RegExp(text));
  }
}