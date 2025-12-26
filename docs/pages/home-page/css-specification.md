# Home Page CSS Specification

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--page-bg` | `#FFFFFF` | Page background |
| `--section-bg` | `#FFFFFF` | Section backgrounds |
| `--section-bg-alt` | `#F5F5F5` | Alternate section background |
| `--text-primary` | `#111111` | Primary text color |
| `--text-secondary` | `#757575` | Secondary text |
| `--star-color` | `#FFB800` | Rating star color |
| `--star-empty` | `#E5E5E5` | Empty star color |

### Spacing

| Token | Value |
|-------|-------|
| `--section-padding-desktop` | 64px |
| `--section-padding-tablet` | 48px |
| `--section-padding-mobile` | 32px |
| `--section-gap` | 0 |
| `--container-max-width` | 1440px |
| `--container-padding-desktop` | 48px |
| `--container-padding-tablet` | 24px |
| `--container-padding-mobile` | 16px |

## Page Container

```css
.home-page {
    background-color: #FFFFFF;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.home-page main {
    flex: 1;
}
```

## Hero Section (Home Specific)

Extends the base `hero-section` component with home-specific content.

```css
.home-hero {
    position: relative;
    width: 100%;
    height: 700px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

@media (max-width: 1024px) {
    .home-hero {
        height: 600px;
    }
}

@media (max-width: 768px) {
    .home-hero {
        height: auto;
        min-height: 500px;
        padding: 80px 0;
    }
}

.home-hero-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.home-hero-background img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

.home-hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.6) 0%,
        rgba(0, 0, 0, 0.3) 40%,
        rgba(0, 0, 0, 0) 100%
    );
    z-index: 2;
}

.home-hero-content {
    position: relative;
    z-index: 3;
    text-align: center;
    color: #FFFFFF;
    max-width: 800px;
    padding: 0 48px;
}

@media (max-width: 768px) {
    .home-hero-content {
        padding: 0 24px;
    }
}

.home-hero-headline {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 84px;
    font-weight: 800;
    line-height: 1.0;
    letter-spacing: -2px;
    margin-bottom: 24px;
    text-transform: uppercase;
}

@media (max-width: 1024px) {
    .home-hero-headline {
        font-size: 64px;
    }
}

@media (max-width: 768px) {
    .home-hero-headline {
        font-size: 44px;
        letter-spacing: -1px;
    }
}

.home-hero-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 16px 32px;
    font-size: 16px;
    font-weight: 500;
    text-decoration: none;
    border-radius: 30px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: #FFFFFF;
    color: #111111;
}

.home-hero-cta:hover {
    background-color: #E5E5E5;
}

.home-hero-cta:focus {
    outline: 2px solid #FFFFFF;
    outline-offset: 2px;
}
```

## Featured Products Section

```css
.featured-products-section {
    padding: 64px 0;
    background-color: #FFFFFF;
}

@media (max-width: 1024px) {
    .featured-products-section {
        padding: 48px 0;
    }
}

@media (max-width: 768px) {
    .featured-products-section {
        padding: 32px 0;
    }
}

.featured-products-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 48px;
    margin-bottom: 24px;
    max-width: 1440px;
    margin-left: auto;
    margin-right: auto;
}

@media (max-width: 768px) {
    .featured-products-header {
        padding: 0 16px;
    }
}

.featured-products-title {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: #111111;
    line-height: 1.3;
}

@media (max-width: 768px) {
    .featured-products-title {
        font-size: 22px;
    }
}

/* Uses carousel-slider and product-card components */
.featured-products-carousel {
    /* Inherits from carousel-slider */
}
```

## Testimonials Section

```css
.testimonials-section {
    padding: 64px 0;
    background-color: #F5F5F5;
}

@media (max-width: 1024px) {
    .testimonials-section {
        padding: 48px 0;
    }
}

@media (max-width: 768px) {
    .testimonials-section {
        padding: 32px 0;
    }
}

.testimonials-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 48px;
    margin-bottom: 24px;
    max-width: 1440px;
    margin-left: auto;
    margin-right: auto;
}

@media (max-width: 768px) {
    .testimonials-header {
        padding: 0 16px;
    }
}

.testimonials-title {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: #111111;
    line-height: 1.3;
}

@media (max-width: 768px) {
    .testimonials-title {
        font-size: 22px;
    }
}
```

## Testimonial Card Component

```css
.testimonial-card {
    background-color: #FFFFFF;
    border-radius: 0;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    aspect-ratio: 3 / 4;
    display: flex;
    flex-direction: column;
}

.testimonial-card-image {
    flex: 0 0 50%;
    overflow: hidden;
}

.testimonial-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

.testimonial-card-content {
    flex: 0 0 50%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.testimonial-rating {
    display: flex;
    gap: 4px;
}

.testimonial-star {
    width: 16px;
    height: 16px;
}

.testimonial-star.filled {
    color: #FFB800;
    fill: #FFB800;
}

.testimonial-star.empty {
    color: #E5E5E5;
    fill: #E5E5E5;
}

.testimonial-text {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: #111111;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

@media (max-width: 768px) {
    .testimonial-card-content {
        padding: 12px;
        gap: 8px;
    }

    .testimonial-text {
        font-size: 13px;
        -webkit-line-clamp: 3;
    }
}
```

## Carousel Configuration for Home Page

```css
/* Featured Products Carousel */
.featured-products-carousel .carousel-item {
    flex: 0 0 calc(25% - 12px);
    min-width: 250px;
}

@media (max-width: 1200px) {
    .featured-products-carousel .carousel-item {
        flex: 0 0 calc(33.333% - 11px);
    }
}

@media (max-width: 900px) {
    .featured-products-carousel .carousel-item {
        flex: 0 0 calc(50% - 8px);
    }
}

@media (max-width: 600px) {
    .featured-products-carousel .carousel-item {
        flex: 0 0 80%;
    }
}

/* Testimonials Carousel */
.testimonials-carousel .carousel-item {
    flex: 0 0 calc(25% - 12px);
    min-width: 280px;
}

@media (max-width: 1200px) {
    .testimonials-carousel .carousel-item {
        flex: 0 0 calc(33.333% - 11px);
    }
}

@media (max-width: 900px) {
    .testimonials-carousel .carousel-item {
        flex: 0 0 calc(50% - 8px);
    }
}

@media (max-width: 600px) {
    .testimonials-carousel .carousel-item {
        flex: 0 0 85%;
    }
}
```

## Section Spacing Diagram

```
HOME PAGE LAYOUT:

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  NAVIGATION BAR                                                                          │
│  height: 60px                                                                            │
│  z-index: 100                                                                            │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  HERO SECTION                                                                            │
│  height: 700px (desktop) / 600px (tablet) / auto min-height 500px (mobile)              │
│                                                                                          │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│  ▲                                                                                       │
│  64px padding-top                                                                        │
│  ▼                                                                                       │
│  FEATURED PRODUCTS SECTION                                                               │
│  - Section title                                                                         │
│  - Product carousel                                                                      │
│  ▲                                                                                       │
│  64px padding-bottom                                                                     │
│  ▼                                                                                       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│  ▲                                                                                       │
│  64px padding-top                                                                        │
│  ▼                                                                                       │
│  TESTIMONIALS SECTION                                                                    │
│  background: #F5F5F5                                                                     │
│  - Section title                                                                         │
│  - Testimonial carousel                                                                  │
│  ▲                                                                                       │
│  64px padding-bottom                                                                     │
│  ▼                                                                                       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│  FOOTER                                                                                  │
│  background: #111111                                                                     │
│  padding: 48px                                                                           │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Testimonial Card Spacing Diagram

```
TESTIMONIAL CARD (aspect-ratio: 3/4):

┌─────────────────────────────────────┐
│                                      │
│                                      │
│                                      │
│         CUSTOMER PHOTO               │
│         object-fit: cover            │  50% height
│         object-position: center      │
│                                      │
│                                      │
│                                      │
├─────────────────────────────────────┤
│ ▲                                    │
│ 16px padding                         │
│ ▼                                    │
│ ├─16px─┤ ★ ★ ★ ★ ★ ├─16px─┤        │  Star rating
│         │                            │
│         12px gap                     │
│         │                            │
│         "Review text goes here.      │
│          The product was exactly     │  50% height
│          as described..."            │
│         (max 4 lines, truncated)     │
│ ▲                                    │
│ 16px padding                         │
│ ▼                                    │
└─────────────────────────────────────┘

Star Detail:
┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐
│ ★  │  │ ★  │  │ ★  │  │ ★  │  │ ☆  │
│16px│  │16px│  │16px│  │16px│  │16px│
└────┘  └────┘  └────┘  └────┘  └────┘
  └──4px──┘
```

## Animation Specifications

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Hero content | opacity, transform | 600ms | ease-out | Page load |
| Hero CTA button | background-color | 200ms | ease | Hover |
| Product card | transform | 200ms | ease | Hover |
| Carousel scroll | scroll-behavior | smooth | browser | Navigation |
| Testimonial card | box-shadow | 200ms | ease | Hover |

### Hero Entrance Animation

```css
@keyframes heroFadeUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.home-hero-content {
    animation: heroFadeUp 600ms ease-out forwards;
}

.home-hero-headline {
    animation-delay: 100ms;
}

.home-hero-cta {
    animation-delay: 200ms;
}
```

## Accessibility

```css
/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .home-hero-content,
    .home-hero-headline,
    .home-hero-cta {
        animation: none;
    }

    .carousel-track {
        scroll-behavior: auto;
    }

    .testimonial-card,
    .product-card {
        transition: none;
    }
}

/* Focus states */
.home-hero-cta:focus-visible {
    outline: 2px solid #FFFFFF;
    outline-offset: 2px;
}

/* High contrast */
@media (prefers-contrast: high) {
    .home-hero-overlay {
        background: rgba(0, 0, 0, 0.8);
    }
}
```

## Z-Index Stack

| Element | Z-Index |
|---------|---------|
| Navigation Bar | 100 |
| Hero Background | 1 |
| Hero Overlay | 2 |
| Hero Content | 3 |
| Carousel Gradient | 2 |
| Carousel Arrows (inline) | 3 |
| Footer | 1 |

## Component Dependencies

This page specification uses the following component specifications:

| Component | Path | Usage |
|-----------|------|-------|
| Navigation Bar | `/docs/components/navigation-bar` | Global header |
| Hero Section | `/docs/components/hero-section` | Page hero |
| Carousel Slider | `/docs/components/carousel-slider` | Product & testimonial carousels |
| Product Card | `/docs/components/product-card` | Featured products |
| Primary Button | `/docs/components/primary-button` | Hero CTA |
| Typography Display | `/docs/components/typography-display` | Section headings |
| Footer | `/docs/components/footer` | Global footer |
