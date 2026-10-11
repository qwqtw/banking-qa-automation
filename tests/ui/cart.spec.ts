import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';

test.describe('Shopping cart workflow', () => {

  test('user can add product to cart @smoke', async ({ page }) => {

    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goto();

    await loginPage.login(
      'standard_user',
      'secret_sauce'
    );

    await inventoryPage.verifyLoaded();

    await inventoryPage.addProductToCart(
      'Sauce Labs Backpack'
    );

    await inventoryPage.goToCart();

    await cartPage.verifyLoaded();

    await cartPage.verifyProductInCart(
      'Sauce Labs Backpack'
    );

  });

});