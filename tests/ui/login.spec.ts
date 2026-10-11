import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Login tests', () => {

  test('valid user can login successfully @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      'standard_user',
      'secret_sauce'
    );

    await expect(page).toHaveURL(/inventory/);
  });

  test('invalid user sees error message @regression', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      'invalid_user',
      'wrong_password'
    );

    await loginPage.verifyLoginError(
      'Username and password do not match'
    );
  });

});