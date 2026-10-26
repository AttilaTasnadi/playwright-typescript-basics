import { Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  abstract readonly path: string;

  async open() {
    await this.page.goto(this.path);
    return this;
  }
}