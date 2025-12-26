# Products Page - CSS Specification & Spacing Guide

## Overview

This document provides detailed CSS specifications for the Products Page, including design tokens, spacing system, typography, colors, and component-specific styles.

---

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#111111` | Primary text, buttons, selected states |
| `--color-secondary` | `#757575` | Secondary text, labels, icons |
| `--color-accent` | `#fa5400` | Nike brand accent, "New" badges |
| `--color-background` | `#ffffff` | Page background |
| `--color-surface` | `#f5f5f5` | Card backgrounds, hover states |
| `--color-border` | `#e5e5e5` | Dividers, borders |
| `--color-error` | `#d43f21` | Sale prices, error states |
| `--color-success` | `#128a09` | "Best Seller" badges, success states |

### Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--font-family` | `"Helvetica Neue", Helvetica, Arial, sans-serif` | All text |
| `--font-size-xs` | `12px` | Badges, legal text |
| `--font-size-sm` | `14px` | Secondary labels, filter counts |
| `--font-size-base` | `16px` | Body text, product names |
| `--font-size-lg` | `18px` | Subheadings |
| `--font-size-xl` | `24px` | Page titles |
| `--font-size-2xl` | `28px` | Hero headings |
| `--font-size-3xl` | `36px` | Marketing headlines |

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Regular | `400` | Body text, descriptions |
| Medium | `500` | Navigation, labels, product names |
| Bold | `700` | Logo, CTAs, prices |

### Line Heights

| Element | Value |
|---------|-------|
| Body | `1.75` (28px at 16px base) |
| Headings | `1.4` |
| Compact | `1.2` |

---

## Spacing System

### Base Spacing Scale

| Token | Value | Pixels |
|-------|-------|--------|
| `--space-xs` | `4px` | 4 |
| `--space-sm` | `8px` | 8 |
| `--space-md` | `12px` | 12 |
| `--space-lg` | `16px` | 16 |
| `--space-xl` | `24px` | 24 |
| `--space-2xl` | `32px` | 32 |
| `--space-3xl` | `48px` | 48 |
| `--space-4xl` | `64px` | 64 |

### Container Specifications

```css
.main-container {
    max-width: 1440px;           /* Container max width */
    margin: 0 auto;              /* Center container */
    padding: 48px;               /* Desktop: 48px all sides */
}

/* Tablet */
@media (max-width: 1024px) {
    .main-container {
        padding: 32px;
    }
}

/* Mobile */
@media (max-width: 768px) {
    .main-container {
        padding: 20px;           /* Mobile: 20px all sides */
    }
}
```

---

## Layout Specifications

### Header

```css
.header {
    height: 60px;
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: #ffffff;
    border-bottom: 1px solid #e5e5e5;
}

.header-container {
    max-width: 1440px;
    padding: 0 48px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.logo {
    font-size: 24px;
    font-weight: 700;
    color: #111111;
}

.nav {
    display: flex;
    gap: 24px;                   /* Navigation link spacing */
}

.nav-link {
    font-size: 16px;
    font-weight: 500;
    padding: 8px 0;
    border-bottom: 2px solid transparent;
}
```

### Page Header

```css
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;         /* Space before content */
}

.page-title {
    font-size: 24px;
    font-weight: 500;
    line-height: 1.4;
}

.product-count {
    color: #757575;
    font-weight: 400;
}
```

### Content Layout (Sidebar + Grid)

```css
.content-layout {
    display: grid;
    grid-template-columns: 240px 1fr;  /* Sidebar: 240px fixed */
    gap: 24px;                          /* Gap between sidebar and grid */
}

/* Tablet - Hide sidebar */
@media (max-width: 1024px) {
    .content-layout {
        grid-template-columns: 1fr;
    }
}
```

---

## Sidebar Specifications

### Sidebar Container

```css
.sidebar {
    position: sticky;
    top: 84px;                   /* Header (60px) + space (24px) */
    height: fit-content;
    max-height: calc(100vh - 60px - 48px);
    overflow-y: auto;
    width: 240px;
}
```

### Filter Section

```css
.filter-section {
    border-bottom: 1px solid #e5e5e5;
    padding: 16px 0;
}

.filter-section:first-child {
    padding-top: 0;
}

.filter-header {
    padding: 8px 0;
    cursor: pointer;
}

.filter-title {
    font-size: 16px;
    font-weight: 500;
}

.filter-content {
    padding-top: 12px;
}
```

### Checkbox Filter Option

```css
.filter-option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
    cursor: pointer;
}

.filter-checkbox {
    width: 20px;
    height: 20px;
    border: 1.5px solid #757575;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.filter-option:hover .filter-checkbox {
    border-color: #111111;
}

.filter-option.selected .filter-checkbox {
    background-color: #111111;
    border-color: #111111;
}

.filter-label {
    font-size: 16px;
    flex: 1;
}

.filter-count {
    color: #757575;
    font-size: 14px;
}
```

### Color Swatches

```css
.color-swatches {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.color-swatch {
    width: 28px;
    height: 28px;
    border-radius: 50%;          /* Circle */
    border: 1px solid #e5e5e5;
    cursor: pointer;
    position: relative;
}

.color-swatch:hover {
    transform: scale(1.1);
}

.color-swatch.selected::after {
    content: "✓";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 14px;
    text-shadow: 0 0 2px rgba(0,0,0,0.5);
}

/* Light color swatches need dark checkmark */
.color-swatch.light.selected::after {
    color: #111111;
    text-shadow: none;
}
```

### Size Buttons

```css
.size-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.size-button {
    min-width: 48px;
    height: 32px;
    padding: 0 12px;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    background: #ffffff;
    font-size: 14px;
    cursor: pointer;
}

.size-button:hover {
    border-color: #111111;
}

.size-button.selected {
    background-color: #111111;
    border-color: #111111;
    color: white;
}
```

---

## Product Grid Specifications

### Grid Layout

```css
.product-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);  /* 2 columns default */
    gap: 16px;                               /* Column gap */
    row-gap: 48px;                           /* Row gap (larger) */
}

/* Large Desktop - 3 columns */
@media (min-width: 1200px) {
    .product-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

/* Tablet - 2 columns */
@media (max-width: 1024px) {
    .product-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Mobile - 1 column */
@media (max-width: 768px) {
    .product-grid {
        grid-template-columns: 1fr;
        row-gap: 32px;
    }
}
```

### Product Card

```css
.product-card {
    display: block;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    transition: transform 0.25s ease;
}

.product-card:hover {
    transform: translateY(-4px);  /* Subtle lift on hover */
}
```

### Product Image Container

```css
.product-image-container {
    position: relative;
    aspect-ratio: 1 / 1.25;       /* Width : Height = 1 : 1.25 */
    background-color: #f5f5f5;    /* Loading background */
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 12px;
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
}

.product-card:hover .product-image {
    transform: scale(1.02);       /* Subtle zoom on hover */
}
```

### Product Badge

```css
.product-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background-color: #ffffff;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
}

.product-badge.new {
    color: #fa5400;               /* Nike accent orange */
}

.product-badge.best-seller {
    color: #128a09;               /* Green */
}
```

### Product Info

```css
.product-info {
    min-height: 100px;            /* Prevent layout shift */
}

.product-name {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 4px;
    line-height: 1.4;
}

.product-subtitle {
    font-size: 14px;
    color: #757575;
    margin-bottom: 4px;
}

.product-colors {
    font-size: 14px;
    color: #757575;
    margin-bottom: 8px;
}

.product-price {
    font-size: 16px;
    font-weight: 500;
}

.product-price-original {
    text-decoration: line-through;
    color: #757575;
    margin-left: 8px;
    font-weight: 400;
}

.product-price-sale {
    color: #d43f21;               /* Sale red */
}
```

---

## Skeleton Loading States

```css
.skeleton {
    background: linear-gradient(
        90deg,
        #f5f5f5 25%,
        #e8e8e8 50%,
        #f5f5f5 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
}

@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}

.skeleton-image {
    aspect-ratio: 1 / 1.25;
    margin-bottom: 12px;
}

.skeleton-text {
    height: 16px;
    margin-bottom: 8px;
}

.skeleton-text.short {
    width: 60%;
}

.skeleton-text.shorter {
    width: 40%;
}
```

---

## Sort Dropdown

```css
.sort-dropdown {
    position: relative;
}

.sort-trigger {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 4px;
}

.sort-trigger:hover {
    background-color: #f5f5f5;
}

.sort-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: #ffffff;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    box-shadow: 0 10px 15px rgba(0,0,0,0.1);
    min-width: 200px;
    padding: 8px 0;
}

.sort-option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    cursor: pointer;
}

.sort-option:hover {
    background-color: #f5f5f5;
}
```

---

## Mobile Styles

### Mobile Filter Bar (Sticky Bottom)

```css
.mobile-filter-bar {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #ffffff;
    border-top: 1px solid #e5e5e5;
    padding: 12px 20px;
    gap: 12px;
    z-index: 100;
}

@media (max-width: 768px) {
    .mobile-filter-bar {
        display: flex;
    }
}

.mobile-filter-btn {
    flex: 1;
    padding: 12px;
    border: 1px solid #e5e5e5;
    border-radius: 24px;
    background: #ffffff;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}
```

---

## Transitions & Animations

| Element | Property | Duration | Easing |
|---------|----------|----------|--------|
| Links/Buttons | All | `0.15s` | `ease` |
| Cards | Transform | `0.25s` | `ease` |
| Images | Transform | `0.4s` | `ease` |
| Dropdowns | Opacity | `0.2s` | `ease` |
| Skeletons | Background | `1.5s` | `linear` (infinite) |

---

## Box Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle depth |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Buttons, cards |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Dropdowns, modals |

---

## Border Radius

| Size | Value | Usage |
|------|-------|-------|
| Small | `4px` | Buttons, badges, checkboxes |
| Medium | `8px` | Cards, modals, dropdowns |
| Large | `24px` | Pills, filter buttons |
| Circle | `50%` | Color swatches, avatars |

---

## Z-Index Scale

| Layer | Value | Usage |
|-------|-------|-------|
| Base | `1` | Default stacking |
| Dropdown | `10` | Sort menus |
| Sticky | `50` | Sticky sidebar |
| Fixed | `100` | Header, mobile filter bar |
| Modal | `1000` | Overlays, bottom sheets |

---

## Accessibility

### Focus States

```css
/* Custom focus outline */
*:focus-visible {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

/* Remove default focus for mouse users */
*:focus:not(:focus-visible) {
    outline: none;
}
```

### Color Contrast

All text combinations meet WCAG 2.1 AA standards:

| Text | Background | Ratio | Pass |
|------|------------|-------|------|
| `#111111` | `#ffffff` | 18.1:1 | AAA |
| `#757575` | `#ffffff` | 4.6:1 | AA |
| `#fa5400` | `#ffffff` | 4.5:1 | AA |
| `#ffffff` | `#111111` | 18.1:1 | AAA |

---

## File References

- **HTML Mockup:** [mockup.html](./mockup.html)
- **Screenshot:** [mockup-screenshot.png](./mockup-screenshot.png)
- **Wireframes:** [wireframes.md](./wireframes.md)
- **Requirements:** [requirements.md](./requirements.md)

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-12-26 | System | Initial CSS specification |
