import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.title');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  async verifyLoaded() {
    await expect(this.title).toHaveText('Products');
  }

  async addProductToCart(productName: string) {
    const product = this.page
      .locator('.inventory_item')
      .filter({ hasText: productName });

    await product
      .getByRole('button', { name: /add to cart/i })
      .click();
  }

  async goToCart() {
  await Promise.all([
    this.page.waitForURL('**/cart.html'),
    this.cartLink.click()
  ]);
}
}