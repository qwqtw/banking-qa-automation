import { test, expect } from '@playwright/test';

test.describe('API automation', () => {

  test('GET user returns expected response @api @smoke', async ({ request }) => {

    const response = await request.get(
      'https://reqres.in/api/users/2'
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.data.id).toBe(2);
    expect(body.data.email).toContain('@reqres.in');
  });

});

test('POST creates a user successfully @api @regression', async ({ request }) => {

  const response = await request.post(
    'https://reqres.in/api/users',
    {
      data: {
        name: 'Autumn',
        job: 'QA Automation Engineer'
      }
    }
  );

  expect(response.status()).toBe(201);

  const body = await response.json();

  expect(body.name).toBe('Autumn');
  expect(body.job).toBe('QA Automation Engineer');
  expect(body.id).toBeTruthy();
  expect(body.createdAt).toBeTruthy();
});