// pages/LoginModalPage.ts
import { Page } from '@playwright/test';

export class LoginModalPage {
  private page: Page;
  private closeModalButton = '[data-cy="closeModal"]';

  constructor(page: Page) {
    this.page = page;
  }

  async closeModal() {
    await this.page.locator(this.closeModalButton).click();
  }

  async isModalVisible(): Promise<boolean> {
    return this.page.locator(this.closeModalButton).isVisible();
  }
}
