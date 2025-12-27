// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { test, expect, Page } from '@playwright/test';

test.describe('Checkout Page', () => {
  async function addItemToCart(page: Page) {
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
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test.describe('Empty Cart Redirect', () => {
    test('should redirect to cart when cart is empty', async ({ page }) => {
      await page.goto('/checkout');

      // Should redirect to cart page
      await expect(page).toHaveURL(/\/cart/);
    });
  });

  test.describe('Checkout Flow', () => {
    test.beforeEach(async ({ page }) => {
      await addItemToCart(page);
    });

    test('should display checkout page', async ({ page }) => {
      await page.goto('/checkout');

      await expect(page.getByTestId('checkout-page')).toBeVisible();
    });

    test('should display checkout steps', async ({ page }) => {
      await page.goto('/checkout');

      await expect(page.getByTestId('checkout-step-delivery')).toBeVisible();
      await expect(page.getByTestId('checkout-step-payment')).toBeVisible();
      await expect(page.getByTestId('checkout-step-review')).toBeVisible();
    });

    test('should have delivery step active by default', async ({ page }) => {
      await page.goto('/checkout');

      // Delivery step should be expanded
      await expect(page.getByTestId('checkout-email')).toBeVisible();
    });

    test('should display order summary', async ({ page }) => {
      await page.goto('/checkout');

      await expect(page.getByText('Your Order')).toBeVisible();
      await expect(page.getByText('Air Max 270')).toBeVisible();
    });
  });

  test.describe('Delivery Step', () => {
    test.beforeEach(async ({ page }) => {
      await addItemToCart(page);
      await page.goto('/checkout');
    });

    test('should have email field', async ({ page }) => {
      await expect(page.getByTestId('checkout-email')).toBeVisible();
    });

    test('should have phone field', async ({ page }) => {
      await expect(page.getByTestId('checkout-phone')).toBeVisible();
    });

    test('should have address fields', async ({ page }) => {
      await expect(page.getByTestId('checkout-firstname')).toBeVisible();
      await expect(page.getByTestId('checkout-lastname')).toBeVisible();
      await expect(page.getByTestId('checkout-address1')).toBeVisible();
      await expect(page.getByTestId('checkout-city')).toBeVisible();
      await expect(page.getByTestId('checkout-zip')).toBeVisible();
    });

    test('should have shipping options', async ({ page }) => {
      await expect(page.getByText('Standard Shipping')).toBeVisible();
      await expect(page.getByText('Express Shipping')).toBeVisible();
      await expect(page.getByText('Next Day Delivery')).toBeVisible();
    });

    test('should have continue button disabled initially', async ({ page }) => {
      await expect(page.getByTestId('checkout-delivery-continue')).toBeDisabled();
    });

    test('should enable continue button when form is valid', async ({ page }) => {
      await page.getByTestId('checkout-email').locator('input').fill('test@example.com');
      await page.getByTestId('checkout-phone').locator('input').fill('555-123-4567');
      await page.getByTestId('checkout-firstname').locator('input').fill('John');
      await page.getByTestId('checkout-lastname').locator('input').fill('Doe');
      await page.getByTestId('checkout-address1').locator('input').fill('123 Main St');
      await page.getByTestId('checkout-city').locator('input').fill('New York');
      await page.getByTestId('checkout-state').selectOption('NY');
      await page.getByTestId('checkout-zip').locator('input').fill('10001');

      await expect(page.getByTestId('checkout-delivery-continue')).toBeEnabled();
    });
  });

  test.describe('Payment Step', () => {
    test.beforeEach(async ({ page }) => {
      await addItemToCart(page);
      await page.goto('/checkout');

      // Fill out delivery form
      await page.getByTestId('checkout-email').locator('input').fill('test@example.com');
      await page.getByTestId('checkout-phone').locator('input').fill('555-123-4567');
      await page.getByTestId('checkout-firstname').locator('input').fill('John');
      await page.getByTestId('checkout-lastname').locator('input').fill('Doe');
      await page.getByTestId('checkout-address1').locator('input').fill('123 Main St');
      await page.getByTestId('checkout-city').locator('input').fill('New York');
      await page.getByTestId('checkout-state').selectOption('NY');
      await page.getByTestId('checkout-zip').locator('input').fill('10001');

      await page.getByTestId('checkout-delivery-continue').click();
    });

    test('should display payment form after delivery', async ({ page }) => {
      await expect(page.getByText('Credit/Debit Card')).toBeVisible();
    });

    test('should have payment method options', async ({ page }) => {
      await expect(page.getByText('Credit/Debit Card')).toBeVisible();
      await expect(page.getByText('PayPal')).toBeVisible();
      await expect(page.getByText('Klarna')).toBeVisible();
    });

    test('should have card form fields', async ({ page }) => {
      await expect(page.getByTestId('checkout-card-number')).toBeVisible();
      await expect(page.getByTestId('checkout-card-expiry')).toBeVisible();
      await expect(page.getByTestId('checkout-card-cvv')).toBeVisible();
      await expect(page.getByTestId('checkout-card-name')).toBeVisible();
    });
  });

  test.describe('Review Step', () => {
    test.beforeEach(async ({ page }) => {
      await addItemToCart(page);
      await page.goto('/checkout');

      // Complete delivery
      await page.getByTestId('checkout-email').locator('input').fill('test@example.com');
      await page.getByTestId('checkout-phone').locator('input').fill('555-123-4567');
      await page.getByTestId('checkout-firstname').locator('input').fill('John');
      await page.getByTestId('checkout-lastname').locator('input').fill('Doe');
      await page.getByTestId('checkout-address1').locator('input').fill('123 Main St');
      await page.getByTestId('checkout-city').locator('input').fill('New York');
      await page.getByTestId('checkout-state').selectOption('NY');
      await page.getByTestId('checkout-zip').locator('input').fill('10001');
      await page.getByTestId('checkout-delivery-continue').click();

      // Complete payment
      await page.getByTestId('checkout-card-number').locator('input').fill('4111111111111111');
      await page.getByTestId('checkout-card-expiry').locator('input').fill('12/25');
      await page.getByTestId('checkout-card-cvv').locator('input').fill('123');
      await page.getByTestId('checkout-card-name').locator('input').fill('John Doe');
      await page.getByTestId('checkout-payment-continue').click();
    });

    test('should display review step', async ({ page }) => {
      await expect(page.getByText('Shipping Address')).toBeVisible();
      await expect(page.getByText('Payment Method')).toBeVisible();
    });

    test('should display address summary', async ({ page }) => {
      await expect(page.getByText('John Doe')).toBeVisible();
      await expect(page.getByText('123 Main St')).toBeVisible();
    });

    test('should display payment summary', async ({ page }) => {
      await expect(page.getByText('Card ending in 1111')).toBeVisible();
    });

    test('should have place order button', async ({ page }) => {
      await expect(page.getByTestId('checkout-place-order')).toBeVisible();
    });
  });

  test.describe('Order Placement', () => {
    test.beforeEach(async ({ page }) => {
      await addItemToCart(page);
      await page.goto('/checkout');

      // Complete all steps
      await page.getByTestId('checkout-email').locator('input').fill('test@example.com');
      await page.getByTestId('checkout-phone').locator('input').fill('555-123-4567');
      await page.getByTestId('checkout-firstname').locator('input').fill('John');
      await page.getByTestId('checkout-lastname').locator('input').fill('Doe');
      await page.getByTestId('checkout-address1').locator('input').fill('123 Main St');
      await page.getByTestId('checkout-city').locator('input').fill('New York');
      await page.getByTestId('checkout-state').selectOption('NY');
      await page.getByTestId('checkout-zip').locator('input').fill('10001');
      await page.getByTestId('checkout-delivery-continue').click();

      await page.getByTestId('checkout-card-number').locator('input').fill('4111111111111111');
      await page.getByTestId('checkout-card-expiry').locator('input').fill('12/25');
      await page.getByTestId('checkout-card-cvv').locator('input').fill('123');
      await page.getByTestId('checkout-card-name').locator('input').fill('John Doe');
      await page.getByTestId('checkout-payment-continue').click();
    });

    test('should place order and redirect to confirmation', async ({ page }) => {
      await page.getByTestId('checkout-place-order').click();

      // Wait for redirect to order confirmation
      await expect(page).toHaveURL(/\/order-confirmation\//);
    });
  });

  test.describe('Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      await addItemToCart(page);
    });

    test('should have accessible checkout page', async ({ page }) => {
      await page.goto('/checkout');

      await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();
    });

    test('should have secure checkout badge', async ({ page }) => {
      await page.goto('/checkout');

      await expect(page.getByText('Secure Checkout')).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await addItemToCart(page);
      await page.goto('/checkout');

      await expect(page.getByTestId('checkout-page')).toBeVisible();
    });
  });
});
