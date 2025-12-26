// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { test, expect } from '@playwright/test';

test.describe('Admin Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display admin login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Vult Admin' })).toBeVisible();
    await expect(page.getByText('Sign in to manage your catalog')).toBeVisible();
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('should validate username minimum length', async ({ page }) => {
    await page.getByLabel('Username').fill('ab');
    await page.getByLabel('Password').click();

    await expect(page.getByText('Username must be at least 3 characters')).toBeVisible();
  });

  test('should validate password minimum length', async ({ page }) => {
    await page.getByLabel('Password').fill('12345');
    await page.getByLabel('Username').click();

    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
  });

  test('should redirect to products on successful login', async ({ page }) => {
    await page.route('**/api/user/token', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
          refreshToken: 'refresh-token'
        })
      });
    });

    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('adminpass');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL(/\/products/);
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.route('**/api/user/token', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Invalid credentials'
        })
      });
    });

    await page.getByLabel('Username').fill('baduser');
    await page.getByLabel('Password').fill('badpass');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });
});
