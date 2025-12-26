# Product Card Component

## Overview
A versatile product display card used throughout the Nike e-commerce experience to showcase individual products. The card presents product imagery, pricing, and essential details in a compact, scannable format optimized for both browsing and conversion.

## Requirements

### Functional Requirements

1. **Product Image**
   - Display primary product image
   - Support for hover image swap (secondary angle)
   - Lazy loading for performance
   - Multiple aspect ratio support (portrait 3:4 preferred)
   - Support for responsive image sources

2. **Product Information**
   - Product name/title (truncate after 2 lines)
   - Product category/type
   - Color variants indicator (number of colors)
   - Price display (regular and sale)
   - "New" or "Best Seller" badge support

3. **Pricing Display**
   - Regular price
   - Sale price with original price struck through
   - Member exclusive pricing indicator
   - Price range for multi-variant products

4. **Quick Actions**
   - Favorite/Wishlist button (heart icon)
   - Quick view capability
   - Add to cart (optional inline)

5. **Navigation**
   - Entire card clickable to product detail page
   - Color variant swatches (quick color change)

6. **Status Indicators**
   - "Just In" label
   - "Sold Out" overlay
   - "Coming Soon" state
   - Member exclusive badge

### Non-Functional Requirements

1. **Performance**
   - Image loading < 200ms
   - Lazy load images below fold
   - Minimize layout shift (CLS < 0.1)

2. **Accessibility**
   - Alt text for all images
   - Keyboard navigable
   - Screen reader support for pricing
   - Focus states visible

3. **Responsive**
   - Fluid width within grid
   - Touch-friendly on mobile
   - Minimum 150px width
   - Maximum 400px width

## Acceptance Criteria

### AC1: Image Display
- **Given** a product card with image
- **When** the card renders
- **Then** the product image displays at 3:4 aspect ratio
- **And** the image is centered and covers the container

### AC2: Hover Image Swap
- **Given** a product with multiple images
- **When** the user hovers over the card on desktop
- **Then** the image transitions to show a secondary angle
- **And** the transition is smooth (200ms)

### AC3: Favorite Button
- **Given** a product card
- **When** the user clicks the heart icon
- **Then** the product is added to favorites
- **And** the heart icon fills to indicate saved state
- **And** the action does not navigate away from the page

### AC4: Sale Price Display
- **Given** a product on sale
- **When** the card renders
- **Then** the sale price is displayed prominently in red/sale color
- **And** the original price is struck through
- **And** the discount percentage may be shown

### AC5: Color Variants
- **Given** a product with multiple colors
- **When** the card renders
- **Then** text indicating number of colors is shown
- **And** clicking different colors updates the product image

### AC6: Click Navigation
- **Given** a product card
- **When** the user clicks anywhere on the card (except favorite)
- **Then** they navigate to the product detail page
- **And** the URL updates appropriately

### AC7: Sold Out State
- **Given** a product that is sold out
- **When** the card renders
- **Then** a "Sold Out" overlay or badge appears
- **And** the card may have reduced opacity

### AC8: Mobile Touch
- **Given** a mobile viewport
- **When** the user taps the product card
- **Then** it navigates to product detail
- **And** there is visual feedback on tap

## Dependencies
- Product image CDN
- Favorites/Wishlist service
- Product catalog API
- Analytics tracking
