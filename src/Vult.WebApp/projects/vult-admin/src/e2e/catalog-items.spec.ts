// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { test, expect } from '@playwright/test';

const mockCatalogItems = {
  items: [
    {
      catalogItemId: '1',
      brandName: 'Adidas',
      description: 'Running shoes',
      size: '10',
      gender: 0,
      itemType: 0,
      estimatedMSRP: 150,
      estimatedResaleValue: 80,
      createdDate: '2024-01-01T00:00:00Z',
      updatedDate: '2024-01-01T00:00:00Z',
      catalogItemImages: []
    },
    {
      catalogItemId: '2',
      brandName: 'Adidas',
      description: 'Sports jacket',
      size: 'L',
      gender: 1,
      itemType: 2,
      estimatedMSRP: 200,
      estimatedResaleValue: 100,
      createdDate: '2024-01-02T00:00:00Z',
      updatedDate: '2024-01-02T00:00:00Z',
      catalogItemImages: []
    }
  ],
  totalCount: 2,
  pageNumber: 1,
  pageSize: 20,
  totalPages: 1
};

test.describe('Admin Catalog Items Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'vult_admin_access_token',
        '"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"'
      );
    });
  });

  test('should display catalog items list', async ({ page }) => {
    await page.route('**/api/catalogitems**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockCatalogItems)
      });
    });

    await page.goto('/catalog-items');

    await expect(page.getByRole('heading', { name: 'Catalog Items' })).toBeVisible();
    await expect(page.getByText('Adidas')).toBeVisible();
  });

  test('should show item type chips', async ({ page }) => {
    await page.route('**/api/catalogitems**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockCatalogItems)
      });
    });

    await page.goto('/catalog-items');

    await expect(page.getByText('Shoe')).toBeVisible();
    await expect(page.getByText('Jacket')).toBeVisible();
  });

  test('should show create form when clicking Create button', async ({ page }) => {
    await page.route('**/api/catalogitems**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockCatalogItems)
      });
    });

    await page.goto('/catalog-items');

    await page.getByRole('button', { name: 'Create' }).click();

    await expect(page.getByRole('heading', { name: 'Create Catalog Item' })).toBeVisible();
    await expect(page.getByLabel('Brand Name')).toBeVisible();
    await expect(page.getByLabel('Description')).toBeVisible();
    await expect(page.getByLabel('Size')).toBeVisible();
  });

  test('should show edit form when selecting an item', async ({ page }) => {
    await page.route('**/api/catalogitems**', async (route) => {
      if (route.request().url().includes('/1')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockCatalogItems.items[0])
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockCatalogItems)
        });
      }
    });

    await page.goto('/catalog-items');

    await page.getByText('Adidas').click();

    await expect(page.getByRole('heading', { name: 'Edit Catalog Item' })).toBeVisible();
    await expect(page.getByLabel('Brand Name')).toHaveValue('Adidas');
    await expect(page.getByLabel('Size')).toHaveValue('10');
  });

  test('should support deep linking to catalog item edit', async ({ page }) => {
    await page.route('**/api/catalogitems**', async (route) => {
      if (route.request().url().includes('/1')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockCatalogItems.items[0])
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockCatalogItems)
        });
      }
    });

    await page.goto('/catalog-items/1');

    await expect(page.getByRole('heading', { name: 'Edit Catalog Item' })).toBeVisible();
    await expect(page.getByLabel('Brand Name')).toHaveValue('Adidas');
  });

  test('should validate price fields', async ({ page }) => {
    await page.route('**/api/catalogitems**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockCatalogItems)
      });
    });

    await page.goto('/catalog-items');
    await page.getByRole('button', { name: 'Create' }).click();

    await page.getByLabel('Estimated MSRP ($)').fill('-10');
    await page.getByLabel('Brand Name').click();

    await expect(page.getByText('Value must be positive')).toBeVisible();
  });

  test('should cancel editing and hide form', async ({ page }) => {
    await page.route('**/api/catalogitems**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockCatalogItems)
      });
    });

    await page.goto('/catalog-items');
    await page.getByRole('button', { name: 'Create' }).click();

    await expect(page.getByRole('heading', { name: 'Create Catalog Item' })).toBeVisible();

    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page.getByRole('heading', { name: 'Create Catalog Item' })).not.toBeVisible();
    await expect(page.getByText('Select an item to edit')).toBeVisible();
  });
});
