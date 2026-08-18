import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  //workers: process.env.CI ? 1 : undefined,
  workers: 1,




  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], ignoreHTTPSErrors: true },
    }
  ],
  reporter: [
    ['line'],
    ['html', { outputFolder: 'reports/playwright-report' }],
    ['allure-playwright',
      {
        detail: true,
        resultsDir: 'reports/allure-results',
        suiteTitle: false,
        cleanResults: true,
      }
    ],
  ],
  use: {
    headless: process.env.CI ? true : false,
    launchOptions: { slowMo: 500, },

    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

  },


});
