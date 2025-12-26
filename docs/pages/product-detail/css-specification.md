# Product Detail Page - CSS Specification

## Overview

This document provides detailed CSS specifications, design tokens, and spacing guidelines for the Product Detail Page component.

---

## Table of Contents

1. [Design Tokens](#design-tokens)
2. [Typography](#typography)
3. [Colors](#colors)
4. [Spacing](#spacing)
5. [Component Specifications](#component-specifications)
6. [Responsive Breakpoints](#responsive-breakpoints)
7. [Animations & Transitions](#animations--transitions)

---

## Design Tokens

### CSS Custom Properties

```css
:root {
    /* ===== COLOR TOKENS ===== */

    /* Primary Colors */
    --color-primary: #111111;
    --color-secondary: #757575;
    --color-white: #ffffff;
    --color-black: #111111;

    /* Semantic Colors */
    --color-success: #128a09;
    --color-error: #d43f21;
    --color-warning: #f5a623;
    --color-info: #0077ff;

    /* Gray Scale */
    --color-gray-50: #fafafa;
    --color-gray-100: #f5f5f5;
    --color-gray-200: #e5e5e5;
    --color-gray-300: #cccccc;
    --color-gray-400: #757575;
    --color-gray-500: #666666;
    --color-gray-600: #444444;
    --color-gray-700: #333333;
    --color-gray-800: #222222;
    --color-gray-900: #111111;

    /* Border Colors */
    --color-border: #e5e5e5;
    --color-border-hover: #cccccc;
    --color-border-active: #111111;
    --color-border-focus: #0077ff;

    /* Background Colors */
    --bg-primary: #ffffff;
    --bg-secondary: #f5f5f5;
    --bg-hover: #fafafa;

    /* ===== TYPOGRAPHY TOKENS ===== */

    /* Font Family */
    --font-family-primary: "Helvetica Neue", Helvetica, Arial, sans-serif;
    --font-family-mono: "SF Mono", Monaco, "Consolas", monospace;

    /* Font Sizes */
    --font-size-xs: 12px;      /* 0.75rem */
    --font-size-sm: 14px;      /* 0.875rem */
    --font-size-base: 16px;    /* 1rem */
    --font-size-lg: 20px;      /* 1.25rem */
    --font-size-xl: 24px;      /* 1.5rem */
    --font-size-2xl: 28px;     /* 1.75rem */
    --font-size-3xl: 32px;     /* 2rem */
    --font-size-4xl: 40px;     /* 2.5rem */

    /* Font Weights */
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;

    /* Line Heights */
    --line-height-tight: 1.2;
    --line-height-snug: 1.375;
    --line-height-normal: 1.5;
    --line-height-relaxed: 1.625;

    /* Letter Spacing */
    --letter-spacing-tight: -0.02em;
    --letter-spacing-normal: 0;
    --letter-spacing-wide: 0.02em;

    /* ===== SPACING TOKENS ===== */
    /* Based on 4px base unit */

    --space-0: 0;
    --space-1: 4px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-5: 20px;
    --space-6: 24px;
    --space-7: 28px;
    --space-8: 32px;
    --space-9: 36px;
    --space-10: 40px;
    --space-12: 48px;
    --space-14: 56px;
    --space-16: 64px;
    --space-20: 80px;
    --space-24: 96px;

    /* ===== BORDER RADIUS ===== */

    --radius-none: 0;
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
    --radius-2xl: 24px;
    --radius-full: 9999px;

    /* ===== SHADOWS ===== */

    --shadow-none: none;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

    /* ===== TRANSITIONS ===== */

    --duration-fast: 150ms;
    --duration-normal: 200ms;
    --duration-slow: 300ms;
    --duration-slower: 500ms;

    --ease-default: ease;
    --ease-in: ease-in;
    --ease-out: ease-out;
    --ease-in-out: ease-in-out;
    --ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);

    /* ===== Z-INDEX SCALE ===== */

    --z-dropdown: 100;
    --z-sticky: 200;
    --z-fixed: 300;
    --z-modal-backdrop: 400;
    --z-modal: 500;
    --z-popover: 600;
    --z-tooltip: 700;
}
```

---

## Typography

### Type Scale

| Token | Size | Weight | Line Height | Use Case |
|-------|------|--------|-------------|----------|
| `title1` | 40px | 700 | 1.2 | Hero headlines |
| `title2` | 32px | 700 | 1.2 | Page titles |
| `title3` | 28px | 500 | 1.2 | Section headers |
| `title4` | 24px | 500 | 1.2 | Product titles |
| `body1` | 16px | 400 | 1.5 | Primary body text |
| `body2` | 14px | 400 | 1.5 | Secondary body text |
| `caption` | 12px | 400 | 1.5 | Captions, labels |
| `button` | 16px | 500 | 1 | Button text |

### Typography Classes

```css
/* Product Title */
.product-title {
    font-family: var(--font-family-primary);
    font-size: var(--font-size-xl);      /* 24px */
    font-weight: var(--font-weight-medium);  /* 500 */
    line-height: var(--line-height-tight);   /* 1.2 */
    letter-spacing: var(--letter-spacing-tight);
    color: var(--color-primary);
}

/* Product Subtitle */
.product-subtitle {
    font-family: var(--font-family-primary);
    font-size: var(--font-size-base);    /* 16px */
    font-weight: var(--font-weight-normal);  /* 400 */
    line-height: var(--line-height-normal);  /* 1.5 */
    color: var(--color-secondary);
}

/* Price - Current */
.price-current {
    font-family: var(--font-family-primary);
    font-size: var(--font-size-lg);      /* 20px */
    font-weight: var(--font-weight-medium);  /* 500 */
    line-height: var(--line-height-normal);
    color: var(--color-primary);
}

/* Price - Original (Strikethrough) */
.price-original {
    font-family: var(--font-family-primary);
    font-size: var(--font-size-base);    /* 16px */
    font-weight: var(--font-weight-normal);
    line-height: var(--line-height-normal);
    color: var(--color-secondary);
    text-decoration: line-through;
}

/* Price - Discount */
.price-discount {
    font-family: var(--font-family-primary);
    font-size: var(--font-size-base);    /* 16px */
    font-weight: var(--font-weight-medium);
    line-height: var(--line-height-normal);
    color: var(--color-success);         /* #128a09 */
}

/* Section Labels */
.section-label {
    font-family: var(--font-family-primary);
    font-size: var(--font-size-base);    /* 16px */
    font-weight: var(--font-weight-medium);  /* 500 */
    line-height: var(--line-height-normal);
    color: var(--color-primary);
}

/* Body Text */
.body-text {
    font-family: var(--font-family-primary);
    font-size: var(--font-size-base);    /* 16px */
    font-weight: var(--font-weight-normal);
    line-height: var(--line-height-normal);  /* 1.5 */
    color: var(--color-secondary);
}
```

---

## Colors

### Color Palette

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRIMARY COLORS                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐    │
│  │███████████│  │           │  │░░░░░░░░░░░│  │▓▓▓▓▓▓▓▓▓▓▓│    │
│  │███████████│  │  #FFFFFF  │  │░░░░░░░░░░░│  │▓▓▓▓▓▓▓▓▓▓▓│    │
│  │███████████│  │   White   │  │ #F5F5F5   │  │ #757575   │    │
│  │  #111111  │  │           │  │  Gray-100 │  │ Secondary │    │
│  │  Primary  │  └───────────┘  └───────────┘  └───────────┘    │
│  └───────────┘                                                  │
├─────────────────────────────────────────────────────────────────┤
│                        SEMANTIC COLORS                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────┐  ┌───────────┐  ┌───────────┐                   │
│  │▓▓▓▓▓▓▓▓▓▓▓│  │▓▓▓▓▓▓▓▓▓▓▓│  │▓▓▓▓▓▓▓▓▓▓▓│                   │
│  │▓▓▓▓▓▓▓▓▓▓▓│  │▓▓▓▓▓▓▓▓▓▓▓│  │▓▓▓▓▓▓▓▓▓▓▓│                   │
│  │  #128A09  │  │  #D43F21  │  │  #0077FF  │                   │
│  │  Success  │  │   Error   │  │   Focus   │                   │
│  └───────────┘  └───────────┘  └───────────┘                   │
├─────────────────────────────────────────────────────────────────┤
│                         GRAY SCALE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  #FAFAFA → #F5F5F5 → #E5E5E5 → #CCCCCC → #757575 → #111111    │
│  Gray-50   Gray-100  Gray-200  Gray-300  Gray-400  Gray-900    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Color Usage Guidelines

| Color Token | Hex | RGB | Usage |
|-------------|-----|-----|-------|
| `--color-primary` | #111111 | rgb(17,17,17) | Primary text, buttons, active states |
| `--color-secondary` | #757575 | rgb(117,117,117) | Secondary text, subtitles, muted content |
| `--color-success` | #128a09 | rgb(18,138,9) | Discount labels, success messages |
| `--color-error` | #d43f21 | rgb(212,63,33) | Error messages, out-of-stock |
| `--color-border` | #e5e5e5 | rgb(229,229,229) | Default borders, dividers |
| `--color-border-active` | #111111 | rgb(17,17,17) | Active/selected borders |
| `--color-gray-100` | #f5f5f5 | rgb(245,245,245) | Background fills, placeholders |
| `--color-gray-300` | #cccccc | rgb(204,204,204) | Inactive borders, disabled states |

---

## Spacing

### Spacing Scale (8px Grid System)

```
┌─────────────────────────────────────────────────────────────────┐
│                        SPACING SCALE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  --space-1:  4px   ▌                                           │
│  --space-2:  8px   ▌▌                                          │
│  --space-3: 12px   ▌▌▌                                         │
│  --space-4: 16px   ▌▌▌▌                                        │
│  --space-5: 20px   ▌▌▌▌▌                                       │
│  --space-6: 24px   ▌▌▌▌▌▌                                      │
│  --space-8: 32px   ▌▌▌▌▌▌▌▌                                    │
│  --space-10: 40px  ▌▌▌▌▌▌▌▌▌▌                                  │
│  --space-12: 48px  ▌▌▌▌▌▌▌▌▌▌▌▌                                │
│  --space-16: 64px  ▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Component Spacing Reference

```
┌─────────────────────────────────────────────────────────────────┐
│                      PAGE CONTAINER                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  padding: 24px (mobile) / 48px (desktop)               │   │
│  │  max-width: 1920px                                      │   │
│  │  margin: 0 auto                                         │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                    PRODUCT CONTAINER                            │
│  ┌──────────────────────┐    ┌──────────────────────┐          │
│  │                      │    │                      │          │
│  │    Image Gallery     │◄──►│    Product Info      │          │
│  │                      │    │                      │          │
│  │                      │ 48px                      │          │
│  │                      │ gap │                      │          │
│  └──────────────────────┘    └──────────────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Detailed Spacing Specifications

```css
/* Page Layout */
.product-page {
    padding: var(--space-6);             /* 24px */
    max-width: 1920px;
    margin: 0 auto;
}

@media (min-width: 960px) {
    .product-page {
        padding: var(--space-12);        /* 48px */
    }
}

/* Product Container Grid */
.product-container {
    display: grid;
    gap: var(--space-8);                 /* 32px mobile */
}

@media (min-width: 960px) {
    .product-container {
        grid-template-columns: 1fr 1fr;
        gap: var(--space-12);            /* 48px desktop */
    }
}

/* Product Info Section */
.product-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);                 /* 24px between sections */
}

/* Product Header */
.product-header {
    gap: var(--space-2);                 /* 8px between title elements */
}

.price-section {
    margin-top: var(--space-2);          /* 8px */
    gap: var(--space-3);                 /* 12px between prices */
}

/* Selectors */
.color-selector,
.size-selector {
    gap: var(--space-3);                 /* 12px */
}

.color-swatches,
.size-grid {
    gap: var(--space-2);                 /* 8px */
}

/* Action Buttons */
.action-buttons {
    gap: var(--space-3);                 /* 12px */
}

/* Accordion */
.accordion-header {
    padding: var(--space-5) 0;           /* 20px vertical */
}

.accordion-body {
    padding-bottom: var(--space-5);      /* 20px */
}

.accordion-body p {
    margin-bottom: var(--space-4);       /* 16px */
}

.accordion-body li {
    margin-bottom: var(--space-2);       /* 8px */
}
```

---

## Component Specifications

### Image Gallery

```css
/* Thumbnail Strip */
.thumbnail-strip {
    width: 60px;
    gap: var(--space-2);                 /* 8px */
    max-height: 600px;
    overflow-y: auto;
}

.thumbnail {
    width: 60px;
    height: 60px;
    border-radius: var(--radius-md);     /* 8px */
    border: 2px solid transparent;
    transition: border-color var(--duration-fast);
}

.thumbnail.active {
    border-color: var(--color-border-active);  /* #111111 */
}

.thumbnail:hover {
    border-color: var(--color-gray-300);       /* #cccccc */
}

/* Main Image */
.main-image-container {
    aspect-ratio: 1 / 1.25;
    border-radius: var(--radius-md);     /* 8px */
    background-color: var(--color-gray-100);
}

/* Mobile Indicators */
.image-indicators {
    gap: var(--space-2);                 /* 8px */
    padding: var(--space-4) 0;           /* 16px */
}

.indicator-dot {
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full);
    background-color: var(--color-gray-300);
}

.indicator-dot.active {
    background-color: var(--color-primary);
}
```

### Color Selector

```css
.color-swatch {
    width: 70px;                         /* Desktop */
    height: 70px;
    border-radius: var(--radius-sm);     /* 4px */
    border: 2px solid transparent;
    transition: border-color var(--duration-fast);
}

@media (max-width: 599px) {
    .color-swatch {
        width: 80px;                     /* Mobile - larger touch target */
        height: 80px;
    }
}

.color-swatch.active {
    border-color: var(--color-border-active);  /* #111111 */
}

.color-swatch:hover {
    border-color: var(--color-gray-300);
}
```

### Size Selector

```css
.size-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: var(--space-2);                 /* 8px */
}

.size-button {
    height: 48px;
    min-width: 64px;
    border: 1px solid var(--color-gray-300);   /* #cccccc */
    border-radius: var(--radius-sm);           /* 4px */
    background: var(--color-white);
    font-size: var(--font-size-base);          /* 16px */
    font-weight: var(--font-weight-normal);
    transition: all var(--duration-fast);
}

.size-button:hover:not(:disabled) {
    border-color: var(--color-primary);
}

.size-button.active {
    background: var(--color-primary);          /* #111111 */
    color: var(--color-white);
    border-color: var(--color-primary);
}

.size-button:disabled {
    opacity: 0.4;
    text-decoration: line-through;
}
```

### Buttons

```css
/* Base Button */
.btn {
    height: 56px;
    border-radius: var(--radius-full);   /* Pill shape */
    font-size: var(--font-size-base);    /* 16px */
    font-weight: var(--font-weight-medium);  /* 500 */
    padding: 0 var(--space-6);           /* 24px horizontal */
    transition: all var(--duration-fast);
}

/* Primary Button (Add to Bag) */
.btn-primary {
    background: var(--color-primary);    /* #111111 */
    color: var(--color-white);
    border: none;
}

.btn-primary:hover {
    background: #2d2d2d;
}

.btn-primary:active {
    background: #000000;
}

.btn-primary:disabled {
    opacity: 0.4;
}

/* Secondary Button (Favorite) */
.btn-secondary {
    background: var(--color-white);
    color: var(--color-primary);
    border: 1px solid var(--color-gray-300);  /* #cccccc */
}

.btn-secondary:hover {
    border-color: var(--color-primary);
}

/* Heart Icon */
.heart-icon {
    width: 20px;
    height: 20px;
}
```

### Accordion

```css
.accordion {
    border-top: 1px solid var(--color-border);  /* #e5e5e5 */
}

.accordion-item {
    border-bottom: 1px solid var(--color-border);
}

.accordion-header {
    width: 100%;
    height: 48px;
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: transparent;
    border: none;
    font-size: var(--font-size-base);    /* 16px */
    font-weight: var(--font-weight-medium);
}

.accordion-icon {
    width: 24px;
    height: 24px;
    transition: transform var(--duration-normal);
}

.accordion-item.open .accordion-icon {
    transform: rotate(180deg);
}

.accordion-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height var(--duration-normal);
}

.accordion-item.open .accordion-content {
    max-height: 500px;
}

.accordion-body {
    padding-bottom: var(--space-5);      /* 20px */
}

.accordion-body ul {
    padding-left: var(--space-5);        /* 20px */
}
```

---

## Responsive Breakpoints

### Breakpoint Definitions

| Name | Width | CSS Media Query |
|------|-------|-----------------|
| Mobile | 0 - 599px | Default styles |
| Tablet | 600 - 959px | `@media (min-width: 600px)` |
| Desktop | 960px+ | `@media (min-width: 960px)` |
| Large Desktop | 1440px+ | `@media (min-width: 1440px)` |

### Responsive Behavior

```css
/* Mobile First Approach */

/* Default (Mobile) */
.product-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-8);
}

.thumbnail-strip {
    display: none;
}

.image-indicators {
    display: flex;
}

.color-swatch {
    width: 80px;
    height: 80px;
}

/* Tablet (600px+) */
@media (min-width: 600px) {
    .product-page {
        padding: var(--space-8);
    }

    .color-swatch {
        width: 70px;
        height: 70px;
    }
}

/* Desktop (960px+) */
@media (min-width: 960px) {
    .product-container {
        grid-template-columns: 1fr 1fr;
        gap: var(--space-12);
    }

    .thumbnail-strip {
        display: flex;
    }

    .image-indicators {
        display: none;
    }

    .product-page {
        padding: var(--space-12);
    }
}

/* Large Desktop (1440px+) */
@media (min-width: 1440px) {
    .product-page {
        padding: var(--space-16);
    }
}
```

---

## Animations & Transitions

### Transition Timing

| Duration | Value | Use Case |
|----------|-------|----------|
| Fast | 150ms | Hovers, button states, micro-interactions |
| Normal | 200ms | Accordion expand/collapse, selection changes |
| Slow | 300ms | Modal entrances, complex state changes |

### Standard Transitions

```css
/* Button Hover */
.btn {
    transition: background-color var(--duration-fast) var(--ease-default),
                border-color var(--duration-fast) var(--ease-default),
                opacity var(--duration-fast) var(--ease-default);
}

/* Border Transitions (Selectors) */
.thumbnail,
.color-swatch,
.size-button {
    transition: border-color var(--duration-fast) var(--ease-default);
}

/* Accordion Chevron Rotation */
.accordion-icon {
    transition: transform var(--duration-normal) var(--ease-default);
}

.accordion-item.open .accordion-icon {
    transform: rotate(180deg);
}

/* Accordion Content */
.accordion-content {
    transition: max-height var(--duration-normal) var(--ease-out);
}

/* Focus Ring */
*:focus-visible {
    outline: 2px solid var(--color-info);  /* #0077ff */
    outline-offset: 2px;
    transition: outline-offset var(--duration-fast) var(--ease-default);
}
```

### Skeleton Loading Animation

```css
@keyframes skeleton-loading {
    0% {
        background-position: -200px 0;
    }
    100% {
        background-position: calc(200px + 100%) 0;
    }
}

.skeleton {
    background: linear-gradient(
        90deg,
        var(--color-gray-100) 0%,
        var(--color-gray-50) 50%,
        var(--color-gray-100) 100%
    );
    background-size: 200px 100%;
    animation: skeleton-loading 1.5s infinite;
}
```

### Heart Icon Toggle Animation

```css
@keyframes heart-bounce {
    0% { transform: scale(1); }
    25% { transform: scale(1.2); }
    50% { transform: scale(0.95); }
    100% { transform: scale(1); }
}

.heart-icon.active {
    animation: heart-bounce 0.3s var(--ease-spring);
}
```

---

## Accessibility Specifications

### Focus States

```css
/* Default Focus Ring */
*:focus-visible {
    outline: 2px solid #0077ff;
    outline-offset: 2px;
}

/* Button Focus */
.btn:focus-visible {
    outline: 2px solid #0077ff;
    outline-offset: 2px;
}

/* Remove default focus for mouse users */
*:focus:not(:focus-visible) {
    outline: none;
}
```

### Color Contrast Requirements

| Element | Foreground | Background | Ratio | WCAG |
|---------|------------|------------|-------|------|
| Primary text | #111111 | #FFFFFF | 18.9:1 | AAA |
| Secondary text | #757575 | #FFFFFF | 4.6:1 | AA |
| Success text | #128a09 | #FFFFFF | 4.5:1 | AA |
| Button text | #FFFFFF | #111111 | 18.9:1 | AAA |
| Disabled text | #757575 (40% opacity) | #FFFFFF | 2.1:1 | Exempt |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-12-26 | Product Team | Initial specification |
