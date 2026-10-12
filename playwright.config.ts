import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['html', { open: 'never' }]
  ],

  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      testMatch: /ui\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      testMatch: /ui\/.*\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      testMatch: /ui\/.*\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
    },

    {
      name: 'api',
      testMatch: /api\/.*\.spec\.ts/,
    },
    {
  name: 'accessibility',
  testMatch: '**/accessibility/**/*.spec.ts',
  use: {
    ...devices['Desktop Chrome']
  }
},
  ],
  
  webServer: [
  {
    command: 'npm run api',
    url: 'http://localhost:3001/accounts/1',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  {
    command: 'npm run dev --prefix banking-ui -- --host 0.0.0.0',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
],
});