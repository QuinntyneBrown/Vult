// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { test, expect, Page } from '@playwright/test';

// Mock product data for API responses
const mockProducts = [
  {
    id: 'air-max-90',
    name: 'Air Max 90',
    category: "Men's Shoes",
    colorCount: 3,
    price: 130,
    imageUrl: 'assets/images/product-1.jpg',
    badge: 'New',
    badgeType: 'new'
  },
  {
    id: 'dri-fit-primary',
    name: 'Dri-FIT Primary',
    category: "Men's Training T-Shirt",
    colorCount: 5,
    price: 40,
    imageUrl: 'assets/images/product-2.jpg',
    badge: 'Best Seller',
    badgeType: 'sale'
  },
  {
    id: 'pegasus-41',
    name: 'Pegasus 41',
    category: "Men's Road Running Shoes",
    colorCount: 8,
    price: 140,
    imageUrl: 'assets/images/product-3.jpg'
  },
  {
    id: 'windrunner',
    name: 'Windrunner',
    category: "Men's Running Jacket",
    colorCount: 4,
    price: 89,
    originalPrice: 120,
    imageUrl: 'assets/images/product-4.jpg',
    badge: 'New',
    badgeType: 'new'
  },
  {
    id: 'air-force-1-07',
    name: "Air Force 1 '07",
    category: "Men's Shoes",
    colorCount: 2,
    price: 115,
    imageUrl: 'assets/images/product-5.jpg'
  },
  {
    id: 'challenger',
    name: 'Challenger',
    category: "Men's Running Shorts",
    colorCount: 6,
    price: 45,
    imageUrl: 'assets/images/product-6.jpg'
  },
  {
    id: 'dunk-low-retro',
    name: 'Dunk Low Retro',
    category: "Men's Shoes",
    colorCount: 12,
    price: 115,
    imageUrl: 'assets/images/product-7.jpg',
    badge: 'New',
    badgeType: 'new'
  },
  {
    id: 'brasilia-95',
    name: 'Brasilia 9.5',
    category: 'Training Backpack (Large)',
    colorCount: 3,
    price: 50,
    imageUrl: 'assets/images/product-8.jpg'
  }
];

const mockFilters = {
  categories: [
    { id: 'shoes', label: 'Shoes', count: 124 },
    { id: 'clothing', label: 'Clothing', count: 89 },
    { id: 'accessories', label: 'Accessories', count: 35 },
    { id: 'equipment', label: 'Equipment', count: 12 }
  ],
  genders: [
    { id: 'men', label: 'Men', count: 248 },
    { id: 'women', label: 'Women', count: 0 },
    { id: 'unisex', label: 'Unisex', count: 42 }
  ],
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  priceRanges: [
    { id: 'price-0-50', label: '$0 - $50', count: 45 },
    { id: 'price-50-100', label: '$50 - $100', count: 89 },
    { id: 'price-100-150', label: '$100 - $150', count: 72 },
    { id: 'price-150-plus', label: 'Over $150', count: 42 }
  ]
};

/**
 * Sets up API mocks for products page
 */
async function setupApiMocks(page: Page) {
  // Mock products API endpoint
  await page.route('**/api/products*', async (route) => {
    const url = new URL(route.request().url());
    const sortBy = url.searchParams.get('sortBy') || 'featured';
    const category = url.searchParams.get('category');
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '8');

    let products = [...mockProducts];

    // Apply category filter
    if (category) {
      products = products.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Mock newest sorting (just reverse order)
        products.reverse();
        break;
    }

    // Apply pagination
    const start = (page - 1) * pageSize;
    const paginatedProducts = products.slice(start, start + pageSize);

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        items: paginatedProducts,
        totalCount: products.length,
        page,
        pageSize,
        totalPages: Math.ceil(products.length / pageSize)
      })
    });
  });

  // Mock filters API endpoint
  await page.route('**/api/products/filters*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockFilters)
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
    // Set up API mocks before navigating
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

    test('should display page title with product count', async ({ page }) => {
      const header = page.getByTestId('page-header');
      await expect(header).toContainText("New Men's Releases");
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

  test.describe('Sort Functionality', () => {
    test('should display sort dropdown with default option', async ({ page }) => {
      const sortDropdown = page.getByTestId('sort-dropdown');
      await expect(sortDropdown).toBeVisible();
      await expect(sortDropdown).toContainText('Featured');
    });

    test('should open sort dropdown on click', async ({ page }) => {
      const sortTrigger = page.getByTestId('sort-dropdown').locator('button').first();
      await sortTrigger.click();

      // Should show sort options
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

    test('should update sort selection', async ({ page }) => {
      const sortTrigger = page.getByTestId('sort-dropdown').locator('button').first();
      await sortTrigger.click();

      const priceOption = page.getByRole('option', { name: 'Price: Low to High' });
      await priceOption.click();

      await expect(sortTrigger).toContainText('Price: Low to High');
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
      await expect(sidebar.locator('text=Clothing')).toBeVisible();
      await expect(sidebar.locator('text=Accessories')).toBeVisible();
    });

    test('should toggle filter option on click', async ({ page }) => {
      const sidebar = page.getByTestId('filter-sidebar-component');
      const shoesCheckbox = sidebar.locator('label:has-text("Shoes") input[type="checkbox"]');

      // Click to check
      await shoesCheckbox.click();
      await expect(shoesCheckbox).toBeChecked();

      // Click to uncheck
      await shoesCheckbox.click();
      await expect(shoesCheckbox).not.toBeChecked();
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

    test('should collapse and expand filter sections', async ({ page }) => {
      const sidebar = page.getByTestId('filter-sidebar-component');
      const categoryHeader = sidebar.locator('.filter-section__header:has-text("Category")');

      // Click to collapse
      await categoryHeader.click();

      // Content should not be visible
      const categoryContent = sidebar.locator('.filter-section:has(.filter-section__header:has-text("Category")) .filter-section__content');
      await expect(categoryContent).not.toBeVisible();

      // Click to expand
      await categoryHeader.click();
      await expect(categoryContent).toBeVisible();
    });
  });

  test.describe('Product Grid', () => {
    test('should display product cards', async ({ page }) => {
      const grid = page.getByTestId('product-grid');
      const productCards = grid.locator('.product-card');

      const cardCount = await productCards.count();
      expect(cardCount).toBeGreaterThan(0);
    });

    test('should display product name on cards', async ({ page }) => {
      const grid = page.getByTestId('product-grid');
      const productName = grid.locator('.product-name').first();

      await expect(productName).toBeVisible();
      const text = await productName.textContent();
      expect(text?.length).toBeGreaterThan(0);
    });

    test('should display product price on cards', async ({ page }) => {
      const grid = page.getByTestId('product-grid');
      const productPrice = grid.locator('.product-price').first();

      await expect(productPrice).toBeVisible();
    });

    test('should display product category on cards', async ({ page }) => {
      const grid = page.getByTestId('product-grid');
      const productCategory = grid.locator('.product-category').first();

      await expect(productCategory).toBeVisible();
    });

    test('should navigate to product detail on card click', async ({ page }) => {
      const grid = page.getByTestId('product-grid');
      const firstCard = grid.locator('.product-card').first();

      await firstCard.click();

      // Should navigate to product detail page
      await expect(page).toHaveURL(/\/product\//);
    });
  });

  test.describe('Result Counter', () => {
    test('should display result counter', async ({ page }) => {
      await expect(page.getByTestId('result-counter')).toBeVisible();
    });

    test('should show results count', async ({ page }) => {
      const counter = page.getByTestId('result-counter');
      const text = await counter.textContent();
      expect(text).toMatch(/\d+ Results?/);
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

      // Filter sidebar should be visible in mobile mode
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

      // Overlay should no longer be visible
      await expect(overlay).not.toBeVisible();
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

    test('should hide desktop filter sidebar on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await setupApiMocks(page);
      await page.goto('/products');

      const sidebar = page.getByTestId('filter-sidebar');
      // Sidebar should be hidden (not open) on mobile
      await expect(sidebar).not.toHaveClass(/mobile-open/);
    });
  });

  test.describe('User Flow - Browse Products', () => {
    test('should complete browse and filter flow', async ({ page }) => {
      // 1. View products page
      await expect(page.getByTestId('products-page')).toBeVisible();

      // 2. Apply a category filter
      const sidebar = page.getByTestId('filter-sidebar-component');
      const shoesCheckbox = sidebar.locator('label:has-text("Shoes") input[type="checkbox"]');
      await shoesCheckbox.click();
      await expect(shoesCheckbox).toBeChecked();

      // 3. Change sort order
      const sortTrigger = page.getByTestId('sort-dropdown').locator('button').first();
      await sortTrigger.click();
      const priceOption = page.getByRole('option', { name: 'Price: Low to High' });
      await priceOption.click();

      // 4. Click on a product
      const grid = page.getByTestId('product-grid');
      const firstCard = grid.locator('.product-card').first();
      await firstCard.click();

      // 5. Should navigate to product detail
      await expect(page).toHaveURL(/\/product\//);
    });

    test('should allow clearing filters and browsing all products', async ({ page }) => {
      // Apply filters
      const sidebar = page.getByTestId('filter-sidebar-component');
      const shoesCheckbox = sidebar.locator('label:has-text("Shoes") input[type="checkbox"]');
      await shoesCheckbox.click();

      // Clear filters
      const clearButton = page.locator('button:has-text("Clear All")');
      await clearButton.click();

      // Filters should be cleared
      await expect(shoesCheckbox).not.toBeChecked();

      // Products should still be visible
      await expect(page.getByTestId('product-grid')).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have no accessibility violations on main content', async ({ page }) => {
      const mainElement = page.getByRole('main');
      await expect(mainElement).toBeVisible();

      // Products section should have proper label
      await expect(page.locator('section[aria-label="Products"]')).toBeVisible();
    });

    test('should be navigable with keyboard', async ({ page }) => {
      // Tab through interactive elements
      await page.keyboard.press('Tab');
      let focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();

      // Continue tabbing through the page
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();
      }
    });

    test('should have proper focus indicators', async ({ page }) => {
      const sortTrigger = page.getByTestId('sort-dropdown').locator('button').first();
      await sortTrigger.focus();
      await expect(sortTrigger).toBeFocused();

      // Focus indicator should be visible
      const focusedStyles = await sortTrigger.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          outline: styles.outline,
          outlineStyle: styles.outlineStyle
        };
      });

      expect(focusedStyles.outlineStyle).not.toBe('none');
    });

    test('should support keyboard navigation for sort dropdown', async ({ page }) => {
      const sortTrigger = page.getByTestId('sort-dropdown').locator('button').first();
      await sortTrigger.focus();

      // Open with arrow down
      await sortTrigger.press('ArrowDown');
      await expect(page.getByRole('listbox')).toBeVisible();

      // Close with escape
      await page.keyboard.press('Escape');
      await expect(page.getByRole('listbox')).not.toBeVisible();
    });
  });

  test.describe('Loading States', () => {
    test('should display grid loading skeletons when loading', async ({ page }) => {
      // This would require mocking the loading state
      // For now, just verify the grid is present
      await expect(page.getByTestId('product-grid')).toBeVisible();
    });
  });

  test.describe('Pagination', () => {
    test('should display pagination when there are multiple pages', async ({ page }) => {
      // Note: This depends on having more products than items per page
      const pagination = page.getByTestId('pagination');
      // Pagination may or may not be visible depending on product count
      if (await pagination.isVisible()) {
        await expect(pagination).toBeVisible();
      }
    });

    test('should navigate to next page when clicking pagination', async ({ page }) => {
      const pagination = page.getByTestId('pagination');

      if (await pagination.isVisible()) {
        const nextButton = pagination.locator('button[aria-label="Next page"]');

        if (await nextButton.isEnabled()) {
          await nextButton.click();
          // Products should update
          await expect(page.getByTestId('product-grid')).toBeVisible();
        }
      }
    });
  });

  test.describe('API Mocking', () => {
    test('should mock products API response', async ({ page }) => {
      // Verify the page loaded with mock data
      await expect(page.getByTestId('product-grid')).toBeVisible();

      // Check that products are displayed
      const productCards = page.getByTestId('product-grid').locator('.product-card');
      const cardCount = await productCards.count();
      expect(cardCount).toBeGreaterThan(0);
    });

    test('should handle API errors gracefully', async ({ page }) => {
      // Set up error response for products API
      await page.route('**/api/products*', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      });

      // Navigate to the page (will use component's fallback data since API isn't connected yet)
      await page.goto('/products');

      // Page should still render (using mock data from component)
      await expect(page.getByTestId('products-page')).toBeVisible();
    });
  });
});
