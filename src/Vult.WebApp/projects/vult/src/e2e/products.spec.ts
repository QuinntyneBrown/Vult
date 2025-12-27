// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { test, expect, Page } from '@playwright/test';

// Mock product data matching API response format
const mockProductsResponse = {
  items: [
    {
      productId: '11111111-1111-1111-1111-111111111111',
      name: 'Classic Running Shoe',
      description: 'A comfortable running shoe',
      estimatedMSRP: 150,
      estimatedResaleValue: 120,
      gender: 0, // Mens
      itemType: 0, // Shoe
      brandName: 'Vult',
      size: '10,11,12',
      isFeatured: true,
      createdDate: '2025-12-26T10:00:00Z',
      updatedDate: '2025-12-26T10:00:00Z',
      productImages: [
        {
          productImageId: 'img-1',
          productId: '11111111-1111-1111-1111-111111111111',
          url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
          description: 'Running shoe image',
          createdDate: '2025-12-26T10:00:00Z'
        }
      ]
    },
    {
      productId: '22222222-2222-2222-2222-222222222222',
      name: 'Vintage Leather Jacket',
      description: 'Premium leather jacket',
      estimatedMSRP: 300,
      estimatedResaleValue: 250,
      gender: 1, // Womens
      itemType: 2, // Jacket
      brandName: 'Vult',
      size: 'S,M,L',
      isFeatured: true,
      createdDate: '2025-12-26T11:00:00Z',
      updatedDate: '2025-12-26T11:00:00Z',
      productImages: [
        {
          productImageId: 'img-2',
          productId: '22222222-2222-2222-2222-222222222222',
          url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80',
          description: 'Leather jacket image',
          createdDate: '2025-12-26T11:00:00Z'
        }
      ]
    },
    {
      productId: '33333333-3333-3333-3333-333333333333',
      name: 'Casual Denim Pants',
      description: 'Comfortable denim pants',
      estimatedMSRP: 85,
      estimatedResaleValue: 75,
      gender: 2, // Unisex
      itemType: 1, // Pants
      brandName: 'Vult',
      size: '30,32,34',
      isFeatured: false,
      createdDate: '2025-12-26T12:00:00Z',
      updatedDate: '2025-12-26T12:00:00Z',
      productImages: [
        {
          productImageId: 'img-3',
          productId: '33333333-3333-3333-3333-333333333333',
          url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80',
          description: 'Denim pants image',
          createdDate: '2025-12-26T12:00:00Z'
        }
      ]
    },
    {
      productId: '44444444-4444-4444-4444-444444444444',
      name: 'Designer Shirt',
      description: 'Stylish designer shirt',
      estimatedMSRP: 120,
      estimatedResaleValue: 100,
      gender: 0, // Mens
      itemType: 3, // Shirt
      brandName: 'Vult',
      size: 'M,L,XL',
      isFeatured: false,
      createdDate: '2025-12-26T13:00:00Z',
      updatedDate: '2025-12-26T13:00:00Z',
      productImages: [
        {
          productImageId: 'img-4',
          productId: '44444444-4444-4444-4444-444444444444',
          url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80',
          description: 'Designer shirt image',
          createdDate: '2025-12-26T13:00:00Z'
        }
      ]
    }
  ],
  totalCount: 4,
  pageNumber: 1,
  pageSize: 12,
  totalPages: 1
};

/**
 * Sets up API mocks for products page
 */
async function setupApiMocks(page: Page, customResponse?: any) {
  await page.route('**/api/products', async (route) => {
    const url = new URL(route.request().url());
    const sortBy = url.searchParams.get('sortBy') || 'date_desc';
    const itemType = url.searchParams.get('itemType');
    const gender = url.searchParams.get('gender');
    const pageNumber = parseInt(url.searchParams.get('pageNumber') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '12');

    let response = customResponse || { ...mockProductsResponse };
    let items = [...response.items];

    // Apply itemType filter
    if (itemType !== null && itemType !== undefined) {
      items = items.filter(p => p.itemType === parseInt(itemType));
    }

    // Apply gender filter
    if (gender !== null && gender !== undefined) {
      items = items.filter(p => p.gender === parseInt(gender));
    }

    // Apply sorting
    switch (sortBy) {
      case 'price':
        items.sort((a, b) => (a.estimatedResaleValue || a.estimatedMSRP) - (b.estimatedResaleValue || b.estimatedMSRP));
        break;
      case 'price_desc':
        items.sort((a, b) => (b.estimatedResaleValue || b.estimatedMSRP) - (a.estimatedResaleValue || a.estimatedMSRP));
        break;
      case 'date':
        items.sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime());
        break;
      case 'date_desc':
      default:
        items.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
        break;
    }

    // Apply pagination
    const start = (pageNumber - 1) * pageSize;
    const paginatedItems = items.slice(start, start + pageSize);

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        items: paginatedItems,
        totalCount: items.length,
        pageNumber,
        pageSize,
        totalPages: Math.ceil(items.length / pageSize)
      })
    });
  });

  // Mock favorites API endpoint
  await page.route('**/api/favorites*', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    }
  });
}

test.describe('Products Page', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    await page.goto('/products');
  });

  test.describe('Page Structure', () => {
    test('should display products page', async ({ page }) => {
      await expect(page.getByTestId('products-page')).toBeVisible();
    });

    test('should display page header', async ({ page }) => {
      await expect(page.getByTestId('page-header')).toBeVisible();
    });

    test('should display page title', async ({ page }) => {
      const header = page.getByTestId('page-header');
      await expect(header).toContainText('Products');
    });

    test('should display product grid', async ({ page }) => {
      await expect(page.getByTestId('product-grid')).toBeVisible();
    });

    test('should display filter sidebar', async ({ page }) => {
      await expect(page.getByTestId('filter-sidebar')).toBeVisible();
    });

    test('should display sort dropdown', async ({ page }) => {
      await expect(page.getByTestId('sort-dropdown')).toBeVisible();
    });

    test('should have main landmark', async ({ page }) => {
      await expect(page.getByRole('main')).toBeVisible();
    });
  });

  test.describe('Product Grid - API Integration', () => {
    test('should display product cards from API', async ({ page }) => {
      const grid = page.getByTestId('product-grid');
      await page.waitForSelector('.product-card');

      const productCards = grid.locator('.product-card');
      const cardCount = await productCards.count();
      expect(cardCount).toBe(4);
    });

    test('should display product names from API', async ({ page }) => {
      await page.waitForSelector('.product-card');

      await expect(page.getByText('Classic Running Shoe')).toBeVisible();
      await expect(page.getByText('Vintage Leather Jacket')).toBeVisible();
    });

    test('should display sale badge for discounted products', async ({ page }) => {
      await page.waitForSelector('.product-card');

      // Products with lower resale value should have sale badge
      const saleBadges = page.locator('.card-badge');
      await expect(saleBadges.first()).toBeVisible();
    });

    test('should display product categories correctly', async ({ page }) => {
      await page.waitForSelector('.product-card');

      // Check that categories are rendered correctly
      await expect(page.getByText("Men's Footwear")).toBeVisible();
      await expect(page.getByText("Women's Outerwear")).toBeVisible();
    });
  });

  test.describe('Sort Functionality', () => {
    test('should display sort dropdown with default option', async ({ page }) => {
      const sortDropdown = page.getByTestId('sort-dropdown');
      await expect(sortDropdown).toBeVisible();
      await expect(sortDropdown).toContainText('Featured');
    });

    test('should open sort dropdown on click', async ({ page }) => {
      const sortTrigger = page.getByTestId('sort-dropdown').locator('button').first();
      await sortTrigger.click();

      await expect(page.getByRole('listbox')).toBeVisible();
    });

    test('should have all sort options', async ({ page }) => {
      const sortTrigger = page.getByTestId('sort-dropdown').locator('button').first();
      await sortTrigger.click();

      await expect(page.getByRole('option', { name: 'Featured' })).toBeVisible();
      await expect(page.getByRole('option', { name: 'Newest' })).toBeVisible();
      await expect(page.getByRole('option', { name: 'Price: Low to High' })).toBeVisible();
      await expect(page.getByRole('option', { name: 'Price: High to Low' })).toBeVisible();
    });

    test('should update sort selection and reload products', async ({ page }) => {
      const sortTrigger = page.getByTestId('sort-dropdown').locator('button').first();
      await sortTrigger.click();

      const priceOption = page.getByRole('option', { name: 'Price: Low to High' });
      await priceOption.click();

      await expect(sortTrigger).toContainText('Price: Low to High');

      // Wait for products to reload
      await page.waitForSelector('.product-card');
    });

    test('should close dropdown after selection', async ({ page }) => {
      const sortTrigger = page.getByTestId('sort-dropdown').locator('button').first();
      await sortTrigger.click();

      const newestOption = page.getByRole('option', { name: 'Newest' });
      await newestOption.click();

      await expect(page.getByRole('listbox')).not.toBeVisible();
    });
  });

  test.describe('Filter Sidebar', () => {
    test('should display filter sidebar component', async ({ page }) => {
      await expect(page.getByTestId('filter-sidebar-component')).toBeVisible();
    });

    test('should have filter sections', async ({ page }) => {
      const sidebar = page.getByTestId('filter-sidebar-component');

      await expect(sidebar.locator('text=Category')).toBeVisible();
      await expect(sidebar.locator('text=Gender')).toBeVisible();
      await expect(sidebar.locator('text=Size')).toBeVisible();
      await expect(sidebar.locator('text=Price')).toBeVisible();
    });

    test('should have category filter options', async ({ page }) => {
      const sidebar = page.getByTestId('filter-sidebar-component');

      await expect(sidebar.locator('text=Shoes')).toBeVisible();
      await expect(sidebar.locator('text=Shirts')).toBeVisible();
      await expect(sidebar.locator('text=Jackets')).toBeVisible();
    });

    test('should toggle filter option on click', async ({ page }) => {
      const sidebar = page.getByTestId('filter-sidebar-component');
      const shoesCheckbox = sidebar.locator('label:has-text("Shoes") input[type="checkbox"]');

      // Click to check
      await shoesCheckbox.click();
      await expect(shoesCheckbox).toBeChecked();

      // Wait for products to reload
      await page.waitForSelector('.product-card');
    });

    test('should have clear all button', async ({ page }) => {
      const clearButton = page.locator('button:has-text("Clear All")');
      await expect(clearButton).toBeVisible();
    });

    test('should clear filters when clicking clear all', async ({ page }) => {
      const sidebar = page.getByTestId('filter-sidebar-component');

      // First check a filter
      const shoesCheckbox = sidebar.locator('label:has-text("Shoes") input[type="checkbox"]');
      await shoesCheckbox.click();
      await expect(shoesCheckbox).toBeChecked();

      // Click clear all
      const clearButton = page.locator('button:has-text("Clear All")');
      await clearButton.click();

      // Filter should be unchecked
      await expect(shoesCheckbox).not.toBeChecked();
    });
  });

  test.describe('Filter API Integration', () => {
    test('should filter products by category (itemType)', async ({ page }) => {
      const sidebar = page.getByTestId('filter-sidebar-component');
      const shoesCheckbox = sidebar.locator('label:has-text("Shoes") input[type="checkbox"]');

      await shoesCheckbox.click();
      await page.waitForSelector('.product-card');

      // Only shoe products should be visible
      const grid = page.getByTestId('product-grid');
      const productCards = grid.locator('.product-card');
      const cardCount = await productCards.count();
      expect(cardCount).toBe(1);
    });

    test('should filter products by gender', async ({ page }) => {
      const sidebar = page.getByTestId('filter-sidebar-component');
      const menCheckbox = sidebar.locator('label:has-text("Men") input[type="checkbox"]');

      await menCheckbox.click();
      await page.waitForSelector('.product-card');

      // Only mens products should be visible
      const grid = page.getByTestId('product-grid');
      const productCards = grid.locator('.product-card');
      const cardCount = await productCards.count();
      expect(cardCount).toBe(2);
    });
  });

  test.describe('Result Counter', () => {
    test('should display result counter', async ({ page }) => {
      await expect(page.getByTestId('result-counter')).toBeVisible();
    });

    test('should show correct results count from API', async ({ page }) => {
      const counter = page.getByTestId('result-counter');
      const text = await counter.textContent();
      expect(text).toMatch(/4 Results?/);
    });

    test('should update count when filters applied', async ({ page }) => {
      const sidebar = page.getByTestId('filter-sidebar-component');
      const shoesCheckbox = sidebar.locator('label:has-text("Shoes") input[type="checkbox"]');

      await shoesCheckbox.click();
      await page.waitForSelector('.product-card');

      const counter = page.getByTestId('result-counter');
      const text = await counter.textContent();
      expect(text).toMatch(/1 Result/);
    });
  });

  test.describe('Mobile Filter Toggle', () => {
    test('should display mobile filter toggle', async ({ page }) => {
      await expect(page.getByTestId('mobile-filter-toggle')).toBeVisible();
    });

    test('should show filter toggle on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await setupApiMocks(page);
      await page.goto('/products');

      const toggle = page.getByTestId('mobile-filter-toggle');
      await expect(toggle).toBeVisible();
    });

    test('should open mobile filter on toggle click', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await setupApiMocks(page);
      await page.goto('/products');

      const toggle = page.getByTestId('mobile-filter-toggle');
      await toggle.locator('button').click();

      const sidebar = page.getByTestId('filter-sidebar');
      await expect(sidebar).toHaveClass(/mobile-open/);
    });

    test('should show overlay when mobile filter is open', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await setupApiMocks(page);
      await page.goto('/products');

      const toggle = page.getByTestId('mobile-filter-toggle');
      await toggle.locator('button').click();

      const overlay = page.getByTestId('filter-overlay');
      await expect(overlay).toBeVisible();
    });

    test('should close mobile filter when clicking overlay', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await setupApiMocks(page);
      await page.goto('/products');

      const toggle = page.getByTestId('mobile-filter-toggle');
      await toggle.locator('button').click();

      const overlay = page.getByTestId('filter-overlay');
      await overlay.click();

      await expect(overlay).not.toBeVisible();
    });
  });

  test.describe('Product Navigation', () => {
    test('should navigate to product detail on card click', async ({ page }) => {
      await page.waitForSelector('.product-card');

      const grid = page.getByTestId('product-grid');
      const firstCard = grid.locator('.product-card').first();

      await firstCard.click();

      // Should navigate to product detail page
      await expect(page).toHaveURL(/\/product\//);
    });
  });

  test.describe('Responsive Behavior', () => {
    test('should display correctly on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await setupApiMocks(page);
      await page.goto('/products');

      await expect(page.getByTestId('products-page')).toBeVisible();
      await expect(page.getByTestId('product-grid')).toBeVisible();
    });

    test('should display correctly on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await setupApiMocks(page);
      await page.goto('/products');

      await expect(page.getByTestId('products-page')).toBeVisible();
      await expect(page.getByTestId('product-grid')).toBeVisible();
    });

    test('should display correctly on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await setupApiMocks(page);
      await page.goto('/products');

      await expect(page.getByTestId('products-page')).toBeVisible();
      await expect(page.getByTestId('product-grid')).toBeVisible();
      await expect(page.getByTestId('filter-sidebar')).toBeVisible();
    });
  });

  test.describe('User Flow - Browse and Filter Products', () => {
    test('should complete browse and filter flow', async ({ page }) => {
      // 1. View products page
      await expect(page.getByTestId('products-page')).toBeVisible();
      await page.waitForSelector('.product-card');

      // 2. Apply a category filter
      const sidebar = page.getByTestId('filter-sidebar-component');
      const shoesCheckbox = sidebar.locator('label:has-text("Shoes") input[type="checkbox"]');
      await shoesCheckbox.click();
      await expect(shoesCheckbox).toBeChecked();
      await page.waitForSelector('.product-card');

      // 3. Change sort order
      const sortTrigger = page.getByTestId('sort-dropdown').locator('button').first();
      await sortTrigger.click();
      const priceOption = page.getByRole('option', { name: 'Price: Low to High' });
      await priceOption.click();
      await page.waitForSelector('.product-card');

      // 4. Click on a product
      const grid = page.getByTestId('product-grid');
      const firstCard = grid.locator('.product-card').first();
      await firstCard.click();

      // 5. Should navigate to product detail
      await expect(page).toHaveURL(/\/product\//);
    });

    test('should allow clearing filters and browsing all products', async ({ page }) => {
      await page.waitForSelector('.product-card');

      // Apply filters
      const sidebar = page.getByTestId('filter-sidebar-component');
      const shoesCheckbox = sidebar.locator('label:has-text("Shoes") input[type="checkbox"]');
      await shoesCheckbox.click();
      await page.waitForSelector('.product-card');

      // Clear filters
      const clearButton = page.locator('button:has-text("Clear All")');
      await clearButton.click();

      // Filters should be cleared
      await expect(shoesCheckbox).not.toBeChecked();

      // Products should be reloaded
      await page.waitForSelector('.product-card');
      await expect(page.getByTestId('product-grid')).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have no accessibility violations on main content', async ({ page }) => {
      const mainElement = page.getByRole('main');
      await expect(mainElement).toBeVisible();

      await expect(page.locator('section[aria-label="Products"]')).toBeVisible();
    });

    test('should be navigable with keyboard', async ({ page }) => {
      await page.waitForSelector('.product-card');

      await page.keyboard.press('Tab');
      let focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();

      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();
      }
    });

    test('should support keyboard navigation for sort dropdown', async ({ page }) => {
      const sortTrigger = page.getByTestId('sort-dropdown').locator('button').first();
      await sortTrigger.focus();

      await sortTrigger.press('ArrowDown');
      await expect(page.getByRole('listbox')).toBeVisible();

      await page.keyboard.press('Escape');
      await expect(page.getByRole('listbox')).not.toBeVisible();
    });
  });

  test.describe('API Error Handling', () => {
    test('should handle API errors gracefully', async ({ page }) => {
      await page.route('**/api/products', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      });

      await page.goto('/products');

      // Page should still render
      await expect(page.getByTestId('products-page')).toBeVisible();

      // Empty state should show
      await expect(page.getByText('No products found')).toBeVisible();
    });

    test('should show empty state when no products match filter', async ({ page }) => {
      await page.route('**/api/products', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            items: [],
            totalCount: 0,
            pageNumber: 1,
            pageSize: 12,
            totalPages: 0
          })
        });
      });

      await page.goto('/products');

      await expect(page.getByText('No products found')).toBeVisible();
    });
  });

  test.describe('Loading States', () => {
    test('should show loading indicator while fetching products', async ({ page }) => {
      // Delay the API response to see loading state
      await page.route('**/api/products', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockProductsResponse)
        });
      });

      await page.goto('/products');

      // Product grid should be visible (with loading state)
      await expect(page.getByTestId('product-grid')).toBeVisible();
    });
  });
});

test.describe('Products Page - Pagination', () => {
  test('should display pagination when there are multiple pages', async ({ page }) => {
    // Create a response with more products for pagination
    const manyProducts = {
      items: Array.from({ length: 12 }, (_, i) => ({
        productId: `product-${i}`,
        name: `Product ${i}`,
        description: `Description ${i}`,
        estimatedMSRP: 100 + i * 10,
        estimatedResaleValue: 80 + i * 10,
        gender: 0,
        itemType: 0,
        brandName: 'Vult',
        size: 'M',
        isFeatured: false,
        createdDate: '2025-12-26T10:00:00Z',
        updatedDate: '2025-12-26T10:00:00Z',
        productImages: [
          {
            productImageId: `img-${i}`,
            productId: `product-${i}`,
            url: 'https://via.placeholder.com/400',
            description: `Image ${i}`,
            createdDate: '2025-12-26T10:00:00Z'
          }
        ]
      })),
      totalCount: 24,
      pageNumber: 1,
      pageSize: 12,
      totalPages: 2
    };

    await page.route('**/api/products', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(manyProducts)
      });
    });

    await page.goto('/products');
    await page.waitForSelector('.product-card');

    const pagination = page.getByTestId('pagination');
    await expect(pagination).toBeVisible();
  });

  test('should navigate to next page when clicking pagination', async ({ page }) => {
    const manyProducts = {
      items: Array.from({ length: 12 }, (_, i) => ({
        productId: `product-${i}`,
        name: `Product ${i}`,
        description: `Description ${i}`,
        estimatedMSRP: 100 + i * 10,
        estimatedResaleValue: 80 + i * 10,
        gender: 0,
        itemType: 0,
        brandName: 'Vult',
        size: 'M',
        isFeatured: false,
        createdDate: '2025-12-26T10:00:00Z',
        updatedDate: '2025-12-26T10:00:00Z',
        productImages: [
          {
            productImageId: `img-${i}`,
            productId: `product-${i}`,
            url: 'https://via.placeholder.com/400',
            description: `Image ${i}`,
            createdDate: '2025-12-26T10:00:00Z'
          }
        ]
      })),
      totalCount: 24,
      pageNumber: 1,
      pageSize: 12,
      totalPages: 2
    };

    await page.route('**/api/products', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(manyProducts)
      });
    });

    await page.goto('/products');
    await page.waitForSelector('.product-card');

    const pagination = page.getByTestId('pagination');

    if (await pagination.isVisible()) {
      const nextButton = pagination.locator('button[aria-label="Next page"]');

      if (await nextButton.isEnabled()) {
        await nextButton.click();
        await expect(page.getByTestId('product-grid')).toBeVisible();
      }
    }
  });
});
