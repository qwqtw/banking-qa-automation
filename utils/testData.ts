import { APIRequestContext, expect } from '@playwright/test';

export async function createTestAccount(
  request: APIRequestContext,
  owner = 'Automation Test User',
  balance = 1000
) {
  const response = await request.post(
    'http://localhost:3001/test/accounts',
    {
      data: {
        owner,
        balance
      }
    }
  );

  expect(response.status()).toBe(201);

  return await response.json();
}