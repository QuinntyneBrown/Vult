import { test, expect } from '@playwright/test';

// NOTE: Make sure `npm start` (ng serve) is running on http://localhost:4200 before running this test.

test('app renders in the browser', async ({ page }) => {
  await page.goto('/');

  // Verify that the Angular app root is present and page title is correct
  await expect(page).toHaveTitle(/VultApp/i);

  // Optionally assert that either the login or catalog UI is visible
  const hasLoginHeading = await page.locator('h1, h2').filter({ hasText: /login/i }).first().isVisible().catch(() => false);
  const hasCatalogHeading = await page.locator('h1, h2').filter({ hasText: /catalog items/i }).first().isVisible().catch(() => false);

  expect(hasLoginHeading || hasCatalogHeading).toBeTruthy();
});
