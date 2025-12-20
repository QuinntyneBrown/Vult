// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { test, expect } from '@playwright/test';

const mockUsers = {
  items: [
    {
      userId: '1',
      username: 'john.doe',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      isActive: true,
      createdDate: '2024-01-01T00:00:00Z',
      updatedDate: '2024-01-01T00:00:00Z'
    },
    {
      userId: '2',
      username: 'jane.smith',
      email: 'jane@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      isActive: false,
      createdDate: '2024-01-02T00:00:00Z',
      updatedDate: '2024-01-02T00:00:00Z'
    }
  ],
  totalCount: 2,
  pageNumber: 1,
  pageSize: 20,
  totalPages: 1
};

test.describe('Admin Users Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'vult_admin_access_token',
        '"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"'
      );
    });
  });

  test('should display users list', async ({ page }) => {
    await page.route('**/api/users**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUsers)
      });
    });

    await page.goto('/users');

    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
    await expect(page.getByText('john.doe')).toBeVisible();
    await expect(page.getByText('jane.smith')).toBeVisible();
  });

  test('should show inactive chip for inactive users', async ({ page }) => {
    await page.route('**/api/users**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUsers)
      });
    });

    await page.goto('/users');

    await expect(page.getByText('Inactive')).toBeVisible();
  });

  test('should show create form when clicking Create button', async ({ page }) => {
    await page.route('**/api/users**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUsers)
      });
    });

    await page.goto('/users');

    await page.getByRole('button', { name: 'Create' }).click();

    await expect(page.getByRole('heading', { name: 'Create User' })).toBeVisible();
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('should show edit form when selecting a user', async ({ page }) => {
    await page.route('**/api/users**', async (route) => {
      if (route.request().url().includes('/1')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockUsers.items[0])
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockUsers)
        });
      }
    });

    await page.goto('/users');

    await page.getByText('john.doe').click();

    await expect(page.getByRole('heading', { name: 'Edit User' })).toBeVisible();
    await expect(page.getByLabel('Username')).toHaveValue('john.doe');
    await expect(page.getByLabel('Email')).toHaveValue('john@example.com');
  });

  test('should support deep linking to user edit', async ({ page }) => {
    await page.route('**/api/users**', async (route) => {
      if (route.request().url().includes('/1')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockUsers.items[0])
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockUsers)
        });
      }
    });

    await page.goto('/users/1');

    await expect(page.getByRole('heading', { name: 'Edit User' })).toBeVisible();
    await expect(page.getByLabel('Username')).toHaveValue('john.doe');
  });

  test('should validate user form', async ({ page }) => {
    await page.route('**/api/users**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUsers)
      });
    });

    await page.goto('/users');
    await page.getByRole('button', { name: 'Create' }).click();

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('Username is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });
});
