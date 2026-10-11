import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
  }

  async verifyLoaded() {
    await expect(this.page).toHaveURL(/cart\.html/);
  }

  async verifyProductInCart(productName: string) {
    const product = this.cartItems.filter({
      hasText: productName
    });

    await expect(product).toHaveCount(1);

    await expect(
      product.locator('.inventory_item_name')
    ).toHaveText(productName);
  }
}