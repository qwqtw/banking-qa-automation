import { test, expect } from '@playwright/test';

test.describe('Banking end-to-end API workflow', () => {

  test('account transfer updates balance and creates transaction @e2e @regression', async ({ request }) => {

    // 1. Get account before transfer
    const beforeResponse = await request.get(
      'http://localhost:3001/accounts/1'
    );

    expect(beforeResponse.status()).toBe(200);

    const beforeAccount = await beforeResponse.json();

    const initialBalance = beforeAccount.balance;

    // 2. Perform transfer
    const transferAmount = 75;

    const transferResponse = await request.post(
      'http://localhost:3001/transfers',
      {
        data: {
          accountId: 1,
          amount: transferAmount
        }
      }
    );

    expect(transferResponse.status()).toBe(201);

    const transferBody = await transferResponse.json();

    expect(transferBody.amount).toBe(transferAmount);
    expect(transferBody.type).toBe('debit');

    // 3. Verify updated account balance
    const afterResponse = await request.get(
      'http://localhost:3001/accounts/1'
    );

    expect(afterResponse.status()).toBe(200);

    const afterAccount = await afterResponse.json();

    expect(afterAccount.balance)
      .toBe(initialBalance - transferAmount);

    // 4. Verify transaction history
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