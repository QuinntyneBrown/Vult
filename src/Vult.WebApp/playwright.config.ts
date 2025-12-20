import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './projects',
  testMatch: '**/e2e/**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'vult',
      testMatch: '**/vult/src/e2e/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200'
      }
    },
    {
      name: 'vult-admin',
      testMatch: '**/vult-admin/src/e2e/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4201'
      }
    }
  ],
  webServer: [
    {
      command: 'npm run start',
      url: 'http://localhost:4200',
      reuseExistingServer: !process.env['CI'],
      timeout: 120000
    },
    {
      command: 'npm run start:admin',
      url: 'http://localhost:4201',
      reuseExistingServer: !process.env['CI'],
      timeout: 120000
    }
  ]
});
