// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { test, expect, Page } from '@playwright/test';

test.describe('Cart Page', () => {
  const mockProduct = {
    productId: 'test-product-1',
    name: 'Air Max 270',
    estimatedMSRP: 150,
    description: 'Test shoe description',
    gender: 0,
    itemType: 0,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    productImages: [
      {
        productImageId: 'img-1',
        productId: 'test-product-1',
        url: 'https://via.placeholder.com/150',
        createdDate: new Date().toISOString()
      }
    ]
  };

  async function addItemToCart(page: Page) {
    // Add item to cart via localStorage
    const cartData = {
      cart: {
        items: [{
          cartItemId: 'cart-item-1',
          productId: 'test-product-1',
          name: 'Air Max 270',
          subtitle: "Men's Shoes",
          imageUrl: 'https://via.placeholder.com/150',
          color: 'Black',
          colorId: 'black',
          size: '10',
          sizeId: 'size-10',
          price: 150,
          quantity: 2,
          maxQuantity: 10,
          isLowStock: false,
          addedAt: new Date().toISOString()
        }],
        subtotal: 300,
        itemCount: 2,
        lastUpdated: new Date().toISOString()
      },
      expiresAt: new Date(Date.now() + 86400000 * 30).toISOString()
    };

    await page.evaluate((data) => {
      localStorage.setItem('vult_cart', JSON.stringify(data));
    }, cartData);
  }

  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test.describe('Empty Cart', () => {
    test('should display empty cart message', async ({ page }) => {
      await page.goto('/cart');

      await expect(page.getByTestId('empty-cart')).toBeVisible();
      await expect(page.getByText('Your Bag is Empty')).toBeVisible();
    });

    test('should have continue shopping button', async ({ page }) => {
      await page.goto('/cart');

      const continueButton = page.getByRole('button', { name: 'Continue Shopping' });
      await expect(continueButton).toBeVisible();
    });

    test('should navigate to products when clicking continue shopping', async ({ page }) => {
      await page.goto('/cart');

      await page.getByRole('button', { name: 'Continue Shopping' }).click();
      await expect(page).toHaveURL(/\/products/);
    });
  });

  test.describe('Cart with Items', () => {
    test.beforeEach(async ({ page }) => {
      await addItemToCart(page);
    });

    test('should display cart items', async ({ page }) => {
      await page.goto('/cart');

      await expect(page.getByTestId('cart-items')).toBeVisible();
      await expect(page.getByText('Air Max 270')).toBeVisible();
    });

    test('should display correct item count', async ({ page }) => {
      await page.goto('/cart');

      const countText = await page.getByTestId('cart-count').textContent();
      expect(countText).toContain('2');
    });

    test('should display cart summary', async ({ page }) => {
      await page.goto('/cart');

      await expect(page.getByTestId('cart-summary')).toBeVisible();
    });

    test('should display subtotal', async ({ page }) => {
      await page.goto('/cart');

      await expect(page.getByText('$300.00')).toBeVisible();
    });

    test('should have checkout button', async ({ page }) => {
      await page.goto('/cart');

      const checkoutBtn = page.getByTestId('cart-summary-checkout-btn');
      await expect(checkoutBtn).toBeVisible();
    });

    test('should navigate to checkout when clicking checkout', async ({ page }) => {
      await page.goto('/cart');

      await page.getByTestId('cart-summary-checkout-btn').click();
      await expect(page).toHaveURL(/\/checkout/);
    });
  });

  test.describe('Cart Item Actions', () => {
    test.beforeEach(async ({ page }) => {
      await addItemToCart(page);
    });

    test('should have quantity selector', async ({ page }) => {
      await page.goto('/cart');

      await expect(page.getByTestId('cart-item-cart-item-1-quantity')).toBeVisible();
    });

    test('should have remove button', async ({ page }) => {
      await page.goto('/cart');

      await expect(page.getByTestId('cart-item-cart-item-1-remove')).toBeVisible();
    });

    test('should remove item when clicking remove', async ({ page }) => {
      await page.goto('/cart');

      await page.getByTestId('cart-item-cart-item-1-remove').click();

      // After removing, cart should be empty
      await expect(page.getByTestId('empty-cart')).toBeVisible();
    });
  });

  test.describe('Free Shipping', () => {
    test('should show free shipping when over $50', async ({ page }) => {
      await addItemToCart(page);
      await page.goto('/cart');

      await expect(page.getByText('Free', { exact: true })).toBeVisible();
    });

    test('should show free shipping qualified message when over $50', async ({ page }) => {
      await addItemToCart(page);
      await page.goto('/cart');

      await expect(page.getByText('FREE Shipping')).toBeVisible();
    });
  });

  test.describe('Promo Code', () => {
    test.beforeEach(async ({ page }) => {
      await addItemToCart(page);
    });

    test('should have promo code input', async ({ page }) => {
      await page.goto('/cart');

      await expect(page.getByTestId('cart-summary-promo')).toBeVisible();
    });

    test('should toggle promo code form', async ({ page }) => {
      await page.goto('/cart');

      await page.getByText('Do you have a Promo Code?').click();

      await expect(page.getByPlaceholder('Enter promo code')).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      await addItemToCart(page);
    });

    test('should have accessible cart page', async ({ page }) => {
      await page.goto('/cart');

      // Check for main heading
      await expect(page.getByRole('heading', { name: 'Bag' })).toBeVisible();
    });

    test('should have accessible buttons', async ({ page }) => {
      await page.goto('/cart');

      const removeBtn = page.getByTestId('cart-item-cart-item-1-remove');
      await expect(removeBtn).toBeEnabled();
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await addItemToCart(page);
      await page.goto('/cart');

      await expect(page.getByTestId('cart-page')).toBeVisible();
      await expect(page.getByTestId('cart-items')).toBeVisible();
    });
  });
});
