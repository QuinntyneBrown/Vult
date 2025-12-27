// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { test, expect } from '@playwright/test';

const mockFeaturedProducts = {
  items: [
    {
      productId: '11111111-1111-1111-1111-111111111111',
      description: 'New Era Blue Jays Cap',
      brandName: 'New Era',
      size: 'One Size',
      gender: 2,
      itemType: 0,
      estimatedMSRP: 55.00,
      estimatedResaleValue: 45.00,
      isFeatured: true,
      createdDate: '2025-12-26T10:00:00Z',
      updatedDate: '2025-12-26T10:00:00Z',
      productImages: [],
    },
    {
      productId: '22222222-2222-2222-2222-222222222222',
      description: 'Vintage Leather Jacket',
      brandName: 'Vult',
      size: 'M',
      gender: 2,
      itemType: 2,
      estimatedMSRP: 250.00,
      estimatedResaleValue: 189.00,
      isFeatured: true,
      createdDate: '2025-12-26T11:00:00Z',
      updatedDate: '2025-12-26T11:00:00Z',
      productImages: [],
    },
    {
      productId: '33333333-3333-3333-3333-333333333333',
      description: 'Classic Denim Jeans',
      brandName: "Levi's",
      size: '32',
      gender: 0,
      itemType: 1,
      estimatedMSRP: 85.00,
      estimatedResaleValue: 75.00,
      isFeatured: true,
      createdDate: '2025-12-26T12:00:00Z',
      updatedDate: '2025-12-26T12:00:00Z',
      productImages: [],
    },
    {
      productId: '44444444-4444-4444-4444-444444444444',
      description: 'Retro Sneakers',
      brandName: 'Vult',
      size: '10',
      gender: 2,
      itemType: 0,
      estimatedMSRP: 150.00,
      estimatedResaleValue: 120.00,
      isFeatured: true,
      createdDate: '2025-12-26T13:00:00Z',
      updatedDate: '2025-12-26T13:00:00Z',
      productImages: [],
    },
  ],
  totalCount: 4,
  pageNumber: 1,
  pageSize: 10,
  totalPages: 1,
};

const mockTestimonials = {
  items: [
    {
      testimonialId: '1',
      customerName: 'Sarah M.',
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
      rating: 5,
      text: 'Amazing quality! The vintage jacket I bought looks brand new.',
      createdDate: '2025-12-26T10:00:00Z',
      updatedDate: '2025-12-26T10:00:00Z',
    },
    {
      testimonialId: '2',
      customerName: 'James K.',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      rating: 5,
      text: 'Found exactly what I was looking for.',
      createdDate: '2025-12-26T11:00:00Z',
      updatedDate: '2025-12-26T11:00:00Z',
    },
    {
      testimonialId: '3',
      customerName: 'Emily R.',
      photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
      rating: 4,
      text: 'Great selection of premium items.',
      createdDate: '2025-12-26T12:00:00Z',
      updatedDate: '2025-12-26T12:00:00Z',
    },
    {
      testimonialId: '4',
      customerName: 'Michael T.',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
      rating: 5,
      text: 'Best marketplace for used premium goods.',
      createdDate: '2025-12-26T13:00:00Z',
      updatedDate: '2025-12-26T13:00:00Z',
    },
  ],
  totalCount: 4,
  pageNumber: 1,
  pageSize: 10,
  totalPages: 1,
};

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the featured products API
    await page.route('**/api/products/featured**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockFeaturedProducts),
      });
    });

    // Mock the testimonials API
    await page.route('**/api/testimonials**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockTestimonials),
      });
    });
  });

  test('should display the home page with hero section', async ({ page }) => {
    await page.goto('/');

    // Check hero section
    await expect(page.getByText('Buy Premium Used Products')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Shop' })).toBeVisible();
  });

  test('should display featured products section', async ({ page }) => {
    await page.goto('/');

    // Check featured products section
    await expect(page.getByText('Featured Products')).toBeVisible();
    await expect(page.locator('.featured-products__carousel')).toBeVisible();
  });

  test('should display featured product cards from API', async ({ page }) => {
    await page.goto('/');

    // Wait for products to load
    await page.waitForSelector('.featured-products__item');

    // Check that product cards are displayed
    const productCards = page.locator('.featured-products__item');
    await expect(productCards).toHaveCount(4);

    // Check that product names are visible
    await expect(page.getByText('New Era Blue Jays Cap')).toBeVisible();
    await expect(page.getByText('Vintage Leather Jacket')).toBeVisible();
  });

  test('should display sale badge for products with lower resale value', async ({ page }) => {
    await page.goto('/');

    // Wait for products to load
    await page.waitForSelector('.featured-products__item');

    // Check that sale badges are present (products with lower resale value than MSRP)
    const saleBadges = page.locator('.card-badge.sale');
    await expect(saleBadges.first()).toBeVisible();
  });

  test('should display testimonials section', async ({ page }) => {
    await page.goto('/');

    // Check testimonials section header
    await expect(page.getByText('Our customers love us')).toBeVisible();
    await expect(page.locator('.testimonials')).toBeVisible();
  });

  test('should display testimonial cards with customer information', async ({ page }) => {
    await page.goto('/');

    // Wait for testimonials to load
    await page.waitForSelector('.testimonial-card');

    // Check that testimonial cards are displayed
    const testimonialCards = page.locator('.testimonial-card');
    await expect(testimonialCards).toHaveCount(4);

    // Check that testimonial content is visible
    await expect(page.getByText('Amazing quality!')).toBeVisible();
    await expect(page.getByText('Found exactly what I was looking for.')).toBeVisible();
  });

  test('should display star ratings for testimonials', async ({ page }) => {
    await page.goto('/');

    // Wait for testimonials to load
    await page.waitForSelector('.testimonial-card');

    // Check that star ratings are visible
    const starContainers = page.locator('.testimonial-card__rating');
    await expect(starContainers.first()).toBeVisible();

    // Check that stars are rendered
    const stars = page.locator('.testimonial-card__star');
    await expect(stars.first()).toBeVisible();
  });

  test('should display customer photos in testimonials', async ({ page }) => {
    await page.goto('/');

    // Wait for testimonials to load
    await page.waitForSelector('.testimonial-card');

    // Check that customer images are present
    const testimonialImages = page.locator('.testimonial-card__image img');
    await expect(testimonialImages.first()).toBeVisible();

    // Check alt text for accessibility
    await expect(testimonialImages.first()).toHaveAttribute('alt', /Vult customer/);
  });

  test('should navigate to catalog when Shop button is clicked', async ({ page }) => {
    await page.goto('/');

    // Click the Shop button
    await page.getByRole('button', { name: 'Shop' }).click();

    // Should navigate to catalog page
    await expect(page).toHaveURL(/\/catalog/);
  });

  test('should handle testimonials API error gracefully with mock data', async ({ page }) => {
    // Override the mock to simulate an error
    await page.route('**/api/testimonials**', async (route) => {
      await route.abort('failed');
    });

    await page.goto('/');

    // The service should fallback to mock data, so testimonials should still be visible
    await page.waitForSelector('.testimonials');
    await expect(page.getByText('Our customers love us')).toBeVisible();
  });

  test('should handle featured products API error gracefully', async ({ page }) => {
    // Override the mock to simulate an error
    await page.route('**/api/products/featured**', async (route) => {
      await route.abort('failed');
    });

    await page.goto('/');

    // Hero section should still be visible even if featured products fail
    await expect(page.getByText('Buy Premium Used Products')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Shop' })).toBeVisible();
  });

  test('should show correct number of filled stars based on rating', async ({ page }) => {
    await page.goto('/');

    // Wait for testimonials to load
    await page.waitForSelector('.testimonial-card');

    // Get the first testimonial rating (should be 5 stars)
    const firstRating = page.locator('.testimonial-card__rating').first();
    const filledStars = firstRating.locator('.testimonial-card__star--filled');

    // First testimonial has rating of 5, so all 5 stars should be filled
    await expect(filledStars).toHaveCount(5);
  });

  test('should have accessible testimonial ratings', async ({ page }) => {
    await page.goto('/');

    // Wait for testimonials to load
    await page.waitForSelector('.testimonial-card');

    // Check that rating has proper ARIA label
    const ratingElements = page.locator('.testimonial-card__rating');
    await expect(ratingElements.first()).toHaveAttribute('aria-label', /out of 5 stars/);
  });

  test('should have lazy loading for testimonial images', async ({ page }) => {
    await page.goto('/');

    // Wait for testimonials to load
    await page.waitForSelector('.testimonial-card');

    // Check that images have lazy loading attribute
    const images = page.locator('.testimonial-card__image img');
    await expect(images.first()).toHaveAttribute('loading', 'lazy');
  });
});

test.describe('Home Page - Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the featured products API
    await page.route('**/api/products/featured**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockFeaturedProducts),
      });
    });

    // Mock the testimonials API
    await page.route('**/api/testimonials**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockTestimonials),
      });
    });
  });

  test('should display properly on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check that sections are visible on mobile
    await expect(page.getByText('Buy Premium Used Products')).toBeVisible();
    await expect(page.getByText('Featured Products')).toBeVisible();
    await expect(page.getByText('Our customers love us')).toBeVisible();
  });

  test('should display properly on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // Check that sections are visible on tablet
    await expect(page.getByText('Buy Premium Used Products')).toBeVisible();
    await expect(page.getByText('Featured Products')).toBeVisible();
    await expect(page.getByText('Our customers love us')).toBeVisible();
  });

  test('should display properly on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // Check that sections are visible on desktop
    await expect(page.getByText('Buy Premium Used Products')).toBeVisible();
    await expect(page.getByText('Featured Products')).toBeVisible();
    await expect(page.getByText('Our customers love us')).toBeVisible();
  });
});
