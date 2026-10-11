import { test, expect } from '@playwright/test';

test.describe('Banking API tests', () => {

  test('GET account returns balance @api @smoke', async ({ request }) => {
    const response = await request.get(
      'http://localhost:3001/accounts/1'
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.id).toBe(1);
    expect(body.owner).toBe('Autumn Wang');
    expect(body.balance).toBeGreaterThan(0);
  });

  test('POST transfer updates account balance @api @regression', async ({ request }) => {
    const beforeResponse = await request.get(
      'http://localhost:3001/accounts/1'
    );

    expect(beforeResponse.status()).toBe(200);

    const before = await beforeResponse.json();

    const transferResponse = await request.post(
      'http://localhost:3001/transfers',
      {
        data: {
          accountId: 1,
          amount: 100
        }
      }
    );

    expect(transferResponse.status()).toBe(201);

    const afterResponse = await request.get(
      'http://localhost:3001/accounts/1'
    );

    const after = await afterResponse.json();

    expect(after.balance).toBe(before.balance - 100);
  });

});

test('transfer creates a transaction record @api @regression', async ({ request }) => {

  const transferResponse = await request.post(
    'http://localhost:3001/transfers',
    {
      data: {
        accountId: 1,
        amount: 50
      }
    }
  );

  expect(transferResponse.status()).toBe(201);

  const transactionsResponse = await request.get(
    'http://localhost:3001/transactions'
  );

  expect(transactionsResponse.status()).toBe(200);

  const transactions = await transactionsResponse.json();

  expect(transactions.length).toBeGreaterThan(0);

  const latestTransaction = transactions[transactions.length - 1];

  expect(latestTransaction.accountId).toBe(1);
  expect(latestTransaction.amount).toBe(50);
  expect(latestTransaction.type).toBe('debit');
});