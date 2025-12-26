# Home Page Requirements

## Overview

The Home Page serves as the primary landing page for the Vult premium used products marketplace. It introduces the brand, showcases featured products, and builds trust through customer testimonials.

## Page Structure

The Home Page is contained within the global application shell:
- **Global Header**: Navigation Bar component (sticky)
- **Page Content**: Hero, Featured Products, Testimonials sections
- **Global Footer**: Footer component

## Layout Requirements

### Responsive Design

| Breakpoint | Width | Layout Behavior |
|------------|-------|-----------------|
| Mobile | < 600px | Single column, stacked sections |
| Tablet | 600px - 1024px | Adaptive grid, 2-3 column layouts |
| Desktop | > 1024px | Full width sections, 4-column grids |

### Page Flow

```
┌─────────────────────────────────────┐
│           Navigation Bar            │
├─────────────────────────────────────┤
│                                     │
│            Hero Section             │
│    "Buy Premium Used Products"      │
│    [Blue Jays New Era Hat Image]    │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      Featured Products Section      │
│      "Featured Products" heading    │
│      [Product Carousel]             │
│                                     │
├─────────────────────────────────────┤
│                                     │
│       Testimonials Section          │
│    "Our customers love us" heading  │
│    [Testimonial Cards Carousel]     │
│                                     │
├─────────────────────────────────────┤
│              Footer                 │
└─────────────────────────────────────┘
```

## Section Requirements

### 1. Hero Section

**Purpose**: Capture attention and communicate the core value proposition.

**Content Requirements**:
- Headline: "Buy Premium Used Products"
- Background Image: New Era Blue Jays cap (used, premium condition)
- Optional CTA button: "Shop Now"
- Optional subheadline for promotional messaging

**Component Used**: `hero-section`

**Specifications**:
- Full viewport width
- Height: 700px (desktop), 600px (tablet), auto min-height 500px (mobile)
- Centered text overlay with gradient for readability
- Image should convey quality and authenticity of used products

### 2. Featured Products Section

**Purpose**: Showcase curated selection of featured products to drive engagement.

**Content Requirements**:
- Section heading: "Featured Products"
- Carousel of product cards (minimum 8 products)
- Navigation arrows for carousel control
- Pagination dots for carousel position

**Components Used**:
- `carousel-slider`
- `product-card`
- `typography-display` (for section heading)

**Specifications**:
- Section padding: 48px (desktop), 24px (mobile)
- Carousel shows 4 items (desktop), 3 items (tablet), 1.2 items (mobile)
- Gap between cards: 16px (desktop), 12px (mobile)
- Section heading uses `title-3` typography (24px, weight 600)

### 3. Testimonials Section

**Purpose**: Build trust and social proof through customer reviews.

**Content Requirements**:
- Section heading: "Our customers love us"
- Carousel of testimonial cards
- Each card contains:
  - Customer photo (takes half the card height)
  - Star rating (1-5 stars)
  - Review text

**Components Used**:
- `carousel-slider`
- Custom testimonial card (uses design tokens from existing components)
- `typography-display`

**Specifications**:
- Section padding: 48px (desktop), 24px (mobile)
- Testimonial card layout:
  - Photo: 50% of card height, object-fit: cover
  - Rating + text: 50% of card height
- Card background: #FFFFFF
- Rating color: #FFB800 (gold stars)
- Text uses `body-2` typography (14px)
- Card aspect ratio: 3:4 (same as product cards for consistency)

## Functional Requirements

### FR-1: Responsive Layout
The page must adapt seamlessly across all device sizes with mobile-first approach.

### FR-2: Carousel Interaction
- Carousels must support touch swipe on mobile devices
- Arrow navigation must be visible on desktop
- Pagination dots must indicate current position
- Carousel must snap to items on scroll

### FR-3: Hero Image Loading
- Hero image must use lazy loading for performance
- Placeholder/skeleton should display during load
- Image must maintain aspect ratio on all devices

### FR-4: Product Card Links
- Product cards in Featured Products carousel must link to product detail pages
- Cards should show hover state on desktop

### FR-5: Accessibility
- All interactive elements must be keyboard navigable
- Images must have appropriate alt text
- Color contrast must meet WCAG AA standards
- Focus states must be visible

## Component Dependencies

| Section | Components Required |
|---------|-------------------|
| Header | `navigation-bar` |
| Hero | `hero-section`, `primary-button` |
| Featured Products | `carousel-slider`, `product-card`, `typography-display` |
| Testimonials | `carousel-slider`, `typography-display` |
| Footer | `footer` |

## Performance Requirements

- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s (hero image)
- Cumulative Layout Shift (CLS): < 0.1
- Images must be optimized and use modern formats (WebP with fallback)

## SEO Requirements

- Proper semantic HTML structure (h1 for hero headline)
- Meta title: "Vult - Buy Premium Used Products"
- Meta description: "Discover premium quality used products at Vult. Shop our curated collection of authenticated, pre-owned items."
- Open Graph tags for social sharing
