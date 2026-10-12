import { test, expect } from '@playwright/test';
import { BankingPage } from '../../pages/BankingPage';
import { createTestAccount } from '../../utils/testData';

test.describe('Banking transfer workflow', () => {

  test(
  'user transfer updates UI and backend state @e2e @smoke',
  async ({ page, request }, testInfo) => {

    const bankingPage = new BankingPage(page);

    // 1. Provision isolated test data
    const account = await createTestAccount(
      request,
      `${testInfo.project.name} Happy Path User`,
      1000
    );

    const accountId = account.id;
    const initialBalance = account.balance;
    const transferAmount = 100;

    // 2. Open this test's unique account
    await bankingPage.goto(accountId);

    await bankingPage.verifyBalance(
      initialBalance
    );

    // 3. Perform transfer through UI
    await bankingPage.transfer(
      transferAmount
    );

    await bankingPage
      .verifyTransferSuccessful();

    // 4. Verify UI state
    const expectedBalance =
      initialBalance - transferAmount;

    await bankingPage.verifyBalance(
      expectedBalance
    );

    await bankingPage.verifyTransactionVisible(
      transferAmount
    );

    // 5. Verify backend state
    const afterResponse = await request.get(
      `http://localhost:3001/accounts/${accountId}`
    );

    expect(afterResponse.status()).toBe(200);

    const afterAccount =
      await afterResponse.json();

    expect(afterAccount.balance)
      .toBe(expectedBalance);

    // 6. Verify backend transaction
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

    expect(matchingTransaction)
      .toBeTruthy();
  }
);

});

test(
  'transfer fails when balance is insufficient @regression',
  async ({ page, request }, testInfo) => {

    const bankingPage = new BankingPage(page);

    const account = await createTestAccount(
      request,
      `${testInfo.project.name} Insufficient Funds User`,
      1000
    );

    await bankingPage.goto(account.id);

    await bankingPage.transfer(5000);

    await expect(
      page.getByTestId('transfer-message')
    ).toHaveText('Insufficient funds');

    // Bonus: ensure failed transfer did not mutate balance
    const response = await request.get(
      `http://localhost:3001/accounts/${account.id}`
    );

    const body = await response.json();

    expect(body.balance).toBe(1000);
  }
);

test(
  'transfer fails for invalid amount @regression',
  async ({ page, request }, testInfo) => {

    const bankingPage = new BankingPage(page);

    const account = await createTestAccount(
      request,
      `${testInfo.project.name} Invalid Amount User`,
      1000
    );

    await bankingPage.goto(account.id);

    await bankingPage.transfer(-100);

    await expect(
      page.getByTestId('transfer-message')
    ).toHaveText('Invalid transfer amount');

    const response = await request.get(
      `http://localhost:3001/accounts/${account.id}`
    );

    const body = await response.json();

    expect(body.balance).toBe(1000);
  }
);