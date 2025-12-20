// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { test, expect } from '@playwright/test';

const mockCatalogItems = {
  items: [
    {
      catalogItemId: '1',
      brandName: 'Nike',
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

test.describe('Catalog Page', () => {
  test.beforeEach(async ({ page }) => {
    // Set up authentication token in localStorage
    await page.addInitScript(() => {
      localStorage.setItem(
        'vult_access_token',
        '"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"'
      );
    });
  });

  test('should display catalog items', async ({ page }) => {
    await page.route('**/api/catalogitems**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockCatalogItems)
      });
    });

    await page.goto('/catalog');

    await expect(page.getByRole('heading', { name: 'Catalog Items' })).toBeVisible();
    await expect(page.getByText('Nike')).toBeVisible();
    await expect(page.getByText('Adidas')).toBeVisible();
  });

  test('should show empty state when no items', async ({ page }) => {
    await page.route('**/api/catalogitems**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: [],
          totalCount: 0,
          pageNumber: 1,
          pageSize: 20,
          totalPages: 0
        })
      });
    });

    await page.goto('/catalog');

    await expect(page.getByText('No catalog items yet')).toBeVisible();
    await expect(page.getByText('Upload photos to get started')).toBeVisible();
  });

  test('should toggle upload section', async ({ page }) => {
    await page.route('**/api/catalogitems**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockCatalogItems)
      });
    });

    await page.goto('/catalog');

    const uploadButton = page.getByRole('button', { name: 'Upload Photos' });
    await expect(uploadButton).toBeVisible();
    await uploadButton.click();

    await expect(page.getByText('Drag and drop photos here')).toBeVisible();

    const hideButton = page.getByRole('button', { name: 'Hide Upload' });
    await hideButton.click();

    await expect(page.getByText('Drag and drop photos here')).not.toBeVisible();
  });

  test('should delete catalog item', async ({ page }) => {
    await page.route('**/api/catalogitems**', async (route) => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({ status: 204 });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockCatalogItems)
        });
      }
    });

    await page.goto('/catalog');

    page.on('dialog', dialog => dialog.accept());

    await page.getByRole('button', { name: 'Delete' }).first().click();
  });
});
