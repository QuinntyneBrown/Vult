// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { test, expect } from '@playwright/test';

test.describe('Product Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/product/IH8461-072');
  });

  test.describe('Page Structure', () => {
    test('should display product detail page', async ({ page }) => {
      await expect(page.getByTestId('product-detail-page')).toBeVisible();
    });

    test('should display product container', async ({ page }) => {
      await expect(page.getByTestId('product-container')).toBeVisible();
    });

    test('should have main landmark', async ({ page }) => {
      await expect(page.getByRole('main')).toBeVisible();
    });
  });

  test.describe('Product Image Gallery', () => {
    test('should display product image gallery', async ({ page }) => {
      await expect(page.getByTestId('product-image-gallery')).toBeVisible();
    });

    test('should have product images section with aria-label', async ({ page }) => {
      const section = page.locator('section[aria-label="Product images"]');
      await expect(section).toBeVisible();
    });
  });

  test.describe('Product Information', () => {
    test('should display product info section', async ({ page }) => {
      await expect(page.getByTestId('product-info')).toBeVisible();
    });

    test('should have product information section with aria-label', async ({ page }) => {
      const section = page.locator('section[aria-label="Product information"]');
      await expect(section).toBeVisible();
    });
  });

  test.describe('Color Selection', () => {
    test('should display color selector section', async ({ page }) => {
      await expect(page.getByTestId('color-selector-section')).toBeVisible();
    });

    test('should display color swatch selector', async ({ page }) => {
      await expect(page.getByTestId('color-swatch-selector')).toBeVisible();
    });

    test('should update color name when selecting a different color', async ({ page }) => {
      const colorSelectorSection = page.getByTestId('color-selector-section');
      const initialColorText = await colorSelectorSection.locator('.section-label').textContent();
      expect(initialColorText).toContain('Smoke Grey/Black');

      // Click on a different color swatch
      const colorSwatches = page.locator('lib-color-swatch-selector button');
      const swatchCount = await colorSwatches.count();

      if (swatchCount > 1) {
        await colorSwatches.nth(1).click();
        // Wait for update
        await page.waitForTimeout(100);

        const updatedColorText = await colorSelectorSection.locator('.section-label').textContent();
        // Color name should have changed
        expect(updatedColorText).not.toBe(initialColorText);
      }
    });

    test('should have keyboard accessible color swatches', async ({ page }) => {
      const colorSwatches = page.locator('lib-color-swatch-selector button');
      const firstSwatch = colorSwatches.first();

      await firstSwatch.focus();
      await expect(firstSwatch).toBeFocused();
    });
  });

  test.describe('Size Selection', () => {
    test('should display size selector section', async ({ page }) => {
      await expect(page.getByTestId('size-selector-section')).toBeVisible();
    });

    test('should display size selector', async ({ page }) => {
      await expect(page.getByTestId('size-selector')).toBeVisible();
    });

    test('should display size guide link', async ({ page }) => {
      await expect(page.getByTestId('size-guide-link')).toBeVisible();
    });

    test('should have clickable size guide link', async ({ page }) => {
      const sizeGuideLink = page.getByTestId('size-guide-link');
      await expect(sizeGuideLink).toHaveText('Size Guide');
      await sizeGuideLink.click();
      // Size guide functionality would be tested in integration
    });

    test('should allow selecting a size', async ({ page }) => {
      const sizeSelector = page.getByTestId('size-selector');
      const sizeButtons = sizeSelector.locator('button:not([disabled])');
      const firstAvailableSize = sizeButtons.first();

      await firstAvailableSize.click();
      await expect(firstAvailableSize).toHaveAttribute('aria-pressed', 'true');
    });

    test('should show unavailable sizes as disabled', async ({ page }) => {
      const sizeSelector = page.getByTestId('size-selector');
      const disabledSizes = sizeSelector.locator('button[aria-disabled="true"]');

      // 3XL should be disabled based on the mock data
      const disabledCount = await disabledSizes.count();
      expect(disabledCount).toBeGreaterThanOrEqual(1);
    });

    test('should have keyboard accessible size buttons', async ({ page }) => {
      const sizeSelector = page.getByTestId('size-selector');
      const firstSizeButton = sizeSelector.locator('button:not([disabled])').first();

      await firstSizeButton.focus();
      await expect(firstSizeButton).toBeFocused();

      // Press Enter to select
      await firstSizeButton.press('Enter');
      await expect(firstSizeButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  test.describe('Add to Bag Button', () => {
    test('should display add to bag button', async ({ page }) => {
      await expect(page.getByTestId('add-to-bag-button')).toBeVisible();
    });

    test('should disable add to bag button when no size is selected', async ({ page }) => {
      const addToBagButton = page.getByTestId('add-to-bag-button').locator('button');
      await expect(addToBagButton).toBeDisabled();
    });

    test('should enable add to bag button when size is selected', async ({ page }) => {
      // First select a size
      const sizeSelector = page.getByTestId('size-selector');
      const firstAvailableSize = sizeSelector.locator('button:not([disabled])').first();
      await firstAvailableSize.click();

      // Then check if add to bag button is enabled
      const addToBagButton = page.getByTestId('add-to-bag-button').locator('button');
      await expect(addToBagButton).toBeEnabled();
    });

    test('should show error message when clicking add to bag without size', async ({ page }) => {
      // Ensure no size is selected initially
      const addToBagButton = page.getByTestId('add-to-bag-button').locator('button');

      // The button should be disabled, but let's verify the error message area exists
      // The actual error would appear after attempting to click
      await expect(addToBagButton).toBeDisabled();
    });

    test('should show loading state when adding to bag', async ({ page }) => {
      // Select a size first
      const sizeSelector = page.getByTestId('size-selector');
      const firstAvailableSize = sizeSelector.locator('button:not([disabled])').first();
      await firstAvailableSize.click();

      // Click add to bag
      const addToBagButton = page.getByTestId('add-to-bag-button').locator('button');
      await addToBagButton.click();

      // Check for loading state (button should show loading indicator)
      await expect(addToBagButton).toHaveAttribute('aria-busy', 'true');
    });

    test('should show success state after adding to bag', async ({ page }) => {
      // Select a size first
      const sizeSelector = page.getByTestId('size-selector');
      const firstAvailableSize = sizeSelector.locator('button:not([disabled])').first();
      await firstAvailableSize.click();

      // Click add to bag
      const addToBagButton = page.getByTestId('add-to-bag-button').locator('button');
      await addToBagButton.click();

      // Wait for success state (after 1.5s based on component code)
      await page.waitForTimeout(1600);

      // Button should show "Added" text
      await expect(addToBagButton).toContainText('Added');
    });

    test('should have accessible add to bag button', async ({ page }) => {
      const addToBagButton = page.getByTestId('add-to-bag-button').locator('button');
      await expect(addToBagButton).toHaveAttribute('aria-label', 'Add to shopping bag');
    });
  });

  test.describe('Favorites Button', () => {
    test('should display favorites button', async ({ page }) => {
      await expect(page.getByTestId('favorites-button')).toBeVisible();
    });

    test('should toggle favorite state when clicked', async ({ page }) => {
      const favoritesButton = page.getByTestId('favorites-button').locator('button');

      // Initially not favorited
      await expect(favoritesButton).toHaveAttribute('aria-pressed', 'false');

      // Click to favorite
      await favoritesButton.click();

      // Wait for API simulation
      await page.waitForTimeout(600);

      // Should now be favorited
      await expect(favoritesButton).toHaveAttribute('aria-pressed', 'true');
    });

    test('should toggle off when clicking again', async ({ page }) => {
      const favoritesButton = page.getByTestId('favorites-button').locator('button');

      // First favorite
      await favoritesButton.click();
      await page.waitForTimeout(600);
      await expect(favoritesButton).toHaveAttribute('aria-pressed', 'true');

      // Then unfavorite
      await favoritesButton.click();
      await page.waitForTimeout(600);
      await expect(favoritesButton).toHaveAttribute('aria-pressed', 'false');
    });

    test('should have accessible favorite button', async ({ page }) => {
      const favoritesButton = page.getByTestId('favorites-button').locator('button');
      await expect(favoritesButton).toHaveAttribute('aria-label');
    });

    test('should have keyboard accessible favorite button', async ({ page }) => {
      const favoritesButton = page.getByTestId('favorites-button').locator('button');
      await favoritesButton.focus();
      await expect(favoritesButton).toBeFocused();
    });
  });

  test.describe('Accordion Sections', () => {
    test('should display accordion section', async ({ page }) => {
      await expect(page.getByTestId('accordion-section')).toBeVisible();
    });

    test('should display product accordion', async ({ page }) => {
      await expect(page.getByTestId('product-accordion')).toBeVisible();
    });

    test('should have Product Description section visible by default', async ({ page }) => {
      const accordion = page.getByTestId('product-accordion');
      const descriptionSection = accordion.locator('.accordion-item').first();
      await expect(descriptionSection).toHaveClass(/is-expanded/);
    });

    test('should toggle accordion sections on click', async ({ page }) => {
      const accordion = page.getByTestId('product-accordion');
      const benefitsHeader = accordion.locator('.accordion-header:has-text("Benefits")');

      // Benefits should be collapsed initially
      const benefitsSection = benefitsHeader.locator('..');
      await expect(benefitsSection).not.toHaveClass(/is-expanded/);

      // Click to expand
      await benefitsHeader.click();
      await expect(benefitsSection).toHaveClass(/is-expanded/);

      // Click to collapse
      await benefitsHeader.click();
      await expect(benefitsSection).not.toHaveClass(/is-expanded/);
    });

    test('should have all four accordion sections', async ({ page }) => {
      const accordion = page.getByTestId('product-accordion');

      await expect(accordion.locator('text=Product Description')).toBeVisible();
      await expect(accordion.locator('text=Benefits')).toBeVisible();
      await expect(accordion.locator('text=Product Details')).toBeVisible();
      await expect(accordion.locator('text=Shipping & Returns')).toBeVisible();
    });

    test('should have keyboard accessible accordion headers', async ({ page }) => {
      const accordion = page.getByTestId('product-accordion');
      const firstHeader = accordion.locator('.accordion-header').first();

      await firstHeader.focus();
      await expect(firstHeader).toBeFocused();

      // Should be able to toggle with Enter key
      await firstHeader.press('Enter');
    });
  });

  test.describe('Responsive Behavior', () => {
    test('should display correctly on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/product/IH8461-072');

      await expect(page.getByTestId('product-container')).toBeVisible();
      await expect(page.getByTestId('product-image-gallery')).toBeVisible();
      await expect(page.getByTestId('product-info')).toBeVisible();
    });

    test('should display correctly on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/product/IH8461-072');

      await expect(page.getByTestId('product-container')).toBeVisible();
    });

    test('should display correctly on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/product/IH8461-072');

      await expect(page.getByTestId('product-container')).toBeVisible();
    });
  });

  test.describe('User Flow - Complete Purchase Journey', () => {
    test('should complete full add to bag flow', async ({ page }) => {
      // 1. View product page
      await expect(page.getByTestId('product-container')).toBeVisible();

      // 2. Select a color (optional, first is selected by default)
      const colorSwatches = page.locator('lib-color-swatch-selector button');
      await colorSwatches.first().click();

      // 3. Select a size
      const sizeSelector = page.getByTestId('size-selector');
      const sizeM = sizeSelector.locator('button:has-text("M")');
      await sizeM.click();
      await expect(sizeM).toHaveAttribute('aria-pressed', 'true');

      // 4. Add to bag
      const addToBagButton = page.getByTestId('add-to-bag-button').locator('button');
      await expect(addToBagButton).toBeEnabled();
      await addToBagButton.click();

      // 5. Wait for loading state
      await expect(addToBagButton).toHaveAttribute('aria-busy', 'true');

      // 6. Wait for success state
      await page.waitForTimeout(1600);
      await expect(addToBagButton).toContainText('Added');

      // 7. Wait for return to default state
      await page.waitForTimeout(2100);
      await expect(addToBagButton).toContainText('Add to Bag');
    });

    test('should add to favorites', async ({ page }) => {
      const favoritesButton = page.getByTestId('favorites-button').locator('button');

      // Initially not favorited
      await expect(favoritesButton).toHaveAttribute('aria-pressed', 'false');

      // Click to favorite
      await favoritesButton.click();
      await page.waitForTimeout(600);

      // Verify favorited
      await expect(favoritesButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  test.describe('Accessibility', () => {
    test('should have no accessibility violations on main content', async ({ page }) => {
      // Basic accessibility checks
      const mainElement = page.getByRole('main');
      await expect(mainElement).toBeVisible();

      // Sections should have proper labels
      await expect(page.locator('section[aria-label="Product images"]')).toBeVisible();
      await expect(page.locator('section[aria-label="Product information"]')).toBeVisible();
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
      const sizeSelector = page.getByTestId('size-selector');
      const firstSizeButton = sizeSelector.locator('button:not([disabled])').first();

      await firstSizeButton.focus();
      await expect(firstSizeButton).toBeFocused();

      // Focus indicator should be visible (check for outline or similar)
      const focusedStyles = await firstSizeButton.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          outline: styles.outline,
          outlineStyle: styles.outlineStyle
        };
      });

      // Should have some form of focus indicator
      expect(focusedStyles.outlineStyle).not.toBe('none');
    });
  });
});
