# Badge Component

## Overview
A compact visual indicator used to highlight product status, promotions, or special attributes. Badges appear on product cards and product detail pages to draw attention to key information.

## Requirements

### Functional Requirements

1. **Badge Types**
   - "Just In" - New arrivals
   - "Sale" - Discounted items
   - "Member Access" - Member exclusive
   - "Best Seller" - Popular items
   - "Sustainable" - Eco-friendly
   - "Limited" - Limited availability
   - Custom text support

2. **Visual Variants**
   - Default (white background, black text)
   - Sale (orange/red background, white text)
   - Member (black background, white text)
   - Sustainable (green background, white text)

3. **Positioning**
   - Top-left of product card (default)
   - Support for multiple badges stacked
   - Z-index above product image

### Non-Functional Requirements

1. **Performance**
   - Lightweight CSS-only rendering
   - No JS required for basic display

2. **Accessibility**
   - Sufficient color contrast (4.5:1 minimum)
   - Screen reader announces badge text
   - Not rely solely on color

## Acceptance Criteria

### AC1: Default Badge
- **Given** a product with "Just In" status
- **When** the card renders
- **Then** a white badge with "Just In" text appears
- **And** it's positioned top-left

### AC2: Sale Badge
- **Given** a product on sale
- **When** the card renders
- **Then** an orange/red badge with "Sale" text appears
- **And** the text is white for contrast

### AC3: Multiple Badges
- **Given** a product with multiple statuses
- **When** the card renders
- **Then** badges stack vertically
- **And** maintain proper spacing

### AC4: Contrast
- **Given** any badge variant
- **When** rendered
- **Then** text/background contrast meets WCAG AA (4.5:1)

## Dependencies
- Product status data
- Z-index layering system
