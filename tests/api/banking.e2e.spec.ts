import { test, expect } from '@playwright/test';
import { createTestAccount } from '../../utils/testData';


test.describe('Banking end-to-end API workflow', () => {

  test(
    'account transfer updates balance and creates transaction @e2e @regression',
    async ({ request }) => {

      const account = await createTestAccount(
        request,
        'API E2E Test User',
        1000
      );

      const transferAmount = 75;

      const transferResponse = await request.post(
        'http://localhost:3001/transfers',
        {
          data: {
            accountId: account.id,
            amount: transferAmount
          }
        }
      );

      expect(transferResponse.status()).toBe(201);

      const afterResponse = await request.get(
        `http://localhost:3001/accounts/${account.id}`
      );

      expect(afterResponse.status()).toBe(200);

      const afterAccount = await afterResponse.json();

      expect(afterAccount.balance)
        .toBe(1000 - transferAmount);

      const transactionsResponse = await request.get(
        'http://localhost:3001/transactions'
      );

      expect(transactionsResponse.status()).toBe(200);

      const transactions = await transactionsResponse.json();

      const matchingTransaction = transactions.find(
        (transaction: any) =>
          transaction.accountId === account.id &&
          transaction.amount === transferAmount
      );

      expect(matchingTransaction).toBeTruthy();
    }
  );

});