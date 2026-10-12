import { test, expect } from '@playwright/test';
import { BankingPage } from '../../pages/BankingPage';

test.describe('Banking transfer workflow', () => {

  test(
    'user transfer updates UI and backend state @e2e @smoke',
    async ({ page, request }, testInfo) => {

      const bankingPage = new BankingPage(page);

      const accountMap: Record<string, number> = {
        chromium: 1,
        firefox: 2,
        webkit: 3
      };

      const accountId =
        accountMap[testInfo.project.name];

      expect(accountId).toBeTruthy();

      // 1. Reset only this browser's account
      const resetResponse = await request.post(
        `http://localhost:3001/test/reset/${accountId}`
      );

      expect(resetResponse.status()).toBe(200);

      // 2. Get initial backend state
      const beforeResponse = await request.get(
        `http://localhost:3001/accounts/${accountId}`
      );

      expect(beforeResponse.status()).toBe(200);

      const beforeAccount =
        await beforeResponse.json();

      const initialBalance =
        beforeAccount.balance;

      const transferAmount = 100;

      // 3. Open isolated banking account
      await bankingPage.goto(accountId);

      await bankingPage.verifyBalance(
        initialBalance
      );

      // 4. Perform transfer through UI
      await bankingPage.transfer(
        transferAmount
      );

      await bankingPage
        .verifyTransferSuccessful();

      // 5. Verify UI state
      const expectedBalance =
        initialBalance - transferAmount;

      await bankingPage.verifyBalance(
        expectedBalance
      );

      await bankingPage
        .verifyTransactionVisible(
          transferAmount
        );

      // 6. Verify backend account state
      const afterResponse = await request.get(
        `http://localhost:3001/accounts/${accountId}`
      );

      expect(afterResponse.status()).toBe(200);

      const afterAccount =
        await afterResponse.json();

      expect(afterAccount.balance)
        .toBe(expectedBalance);

      // 7. Verify backend transaction
      const transactionsResponse =
        await request.get(
          'http://localhost:3001/transactions'
        );

      expect(
        transactionsResponse.status()
      ).toBe(200);

      const transactions =
        await transactionsResponse.json();

      const matchingTransaction =
        transactions.find(
          (transaction: any) =>
            transaction.accountId === accountId &&
            transaction.amount === transferAmount
        );

      expect(
        matchingTransaction
      ).toBeTruthy();
    }
  );

});

test(
  'transfer fails when balance is insufficient @regression',
  async ({ page, request }, testInfo) => {

    const bankingPage = new BankingPage(page);

    const accountMap: Record<string, number> = {
      chromium: 1,
      firefox: 2,
      webkit: 3
    };

    const accountId = accountMap[testInfo.project.name];

    await request.post(
      `http://localhost:3001/test/reset/${accountId}`
    );

    await bankingPage.goto(accountId);

    await bankingPage.transfer(5000);

    await expect(
      page.getByTestId('transfer-message')
    ).toHaveText('Insufficient funds');
  }
);

test(
  'transfer fails for invalid amount @regression',
  async ({ page, request }, testInfo) => {

    const bankingPage = new BankingPage(page);

    const accountMap: Record<string, number> = {
      chromium: 1,
      firefox: 2,
      webkit: 3
    };

    const accountId = accountMap[testInfo.project.name];

    await request.post(
      `http://localhost:3001/test/reset/${accountId}`
    );

    await bankingPage.goto(accountId);

    await bankingPage.transfer(-100);

    await expect(
      page.getByTestId('transfer-message')
    ).toHaveText('Invalid transfer amount');
  }
);