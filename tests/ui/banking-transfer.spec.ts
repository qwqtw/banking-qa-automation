import { test, expect } from '@playwright/test';
import { BankingPage } from '../../pages/BankingPage';

test.describe('Banking transfer workflow', () => {
    
    test.beforeEach(async ({ request }) => {
    const resetResponse = await request.post(
      'http://localhost:3001/test/reset'
    );

    expect(resetResponse.status()).toBe(200);
  });

  test('user transfer updates UI and backend state @e2e @smoke', async ({
    page,
    request
  }) => {

    const bankingPage = new BankingPage(page);

    // 1. Read initial backend state
    const beforeResponse = await request.get(
      'http://localhost:3001/accounts/1'
    );

    expect(beforeResponse.status()).toBe(200);

    const beforeAccount = await beforeResponse.json();

    const initialBalance = beforeAccount.balance;

    const transferAmount = 100;

    // 2. Open banking UI
    await bankingPage.goto();

    await bankingPage.verifyBalance(initialBalance);

    // 3. Perform transfer through UI
    await bankingPage.transfer(transferAmount);

    await bankingPage.verifyTransferSuccessful();

    // 4. Verify UI state
    const expectedBalance = initialBalance - transferAmount;

    await bankingPage.verifyBalance(expectedBalance);

    await bankingPage.verifyTransactionVisible(
      transferAmount
    );

    // 5. Verify backend state through API
    const afterResponse = await request.get(
      'http://localhost:3001/accounts/1'
    );

    expect(afterResponse.status()).toBe(200);

    const afterAccount = await afterResponse.json();

    expect(afterAccount.balance)
      .toBe(expectedBalance);

    // 6. Verify backend transaction
    const transactionsResponse = await request.get(
      'http://localhost:3001/transactions'
    );

    expect(transactionsResponse.status()).toBe(200);

    const transactions = await transactionsResponse.json();

    const matchingTransaction = transactions.find(
      (transaction: any) =>
        transaction.accountId === 1 &&
        transaction.amount === transferAmount
    );

    expect(matchingTransaction).toBeTruthy();
  });

});