# Product Card CSS Specification

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--card-bg` | `#FFFFFF` | Card background |
| `--card-image-bg` | `#F5F5F5` | Image placeholder background |
| `--text-primary` | `#111111` | Product name, price |
| `--text-secondary` | `#757575` | Category, colors, original price |
| `--price-sale` | `#9E3500` | Sale price color |
| `--badge-bg` | `#FFFFFF` | Standard badge background |
| `--badge-sale-bg` | `#9E3500` | Sale badge background |
| `--badge-sale-text` | `#FFFFFF` | Sale badge text |
| `--favorite-bg` | `rgba(255,255,255,0.9)` | Favorite button background |
| `--favorite-bg-hover` | `#FFFFFF` | Favorite button hover |
| `--sold-out-overlay` | `rgba(255,255,255,0.7)` | Sold out overlay |

### Typography

| Element | Font Family | Size | Weight | Line Height | Color |
|---------|-------------|------|--------|-------------|-------|
| Product Name | Helvetica Neue | 16px | 500 | 1.4 | #111111 |
| Category | Helvetica Neue | 14px | 400 | 1.5 | #757575 |
| Colors | Helvetica Neue | 14px | 400 | 1.5 | #757575 |
| Price | Helvetica Neue | 16px | 500 | 1.5 | #111111 |
| Sale Price | Helvetica Neue | 16px | 500 | 1.5 | #9E3500 |
| Original Price | Helvetica Neue | 16px | 400 | 1.5 | #757575 |
| Badge | Helvetica Neue | 12px | 500 | 1.5 | #111111 |
| Sold Out | Helvetica Neue | 14px | 500 | 1.5 | #111111 |

### Spacing

| Token | Value |
|-------|-------|
| `--card-info-padding` | 12px |
| `--badge-padding` | 4px 8px |
| `--favorite-position` | 12px (from top/right) |
| `--content-gap-sm` | 4px |
| `--content-gap-md` | 8px |
| `--grid-gap-desktop` | 16px |
| `--grid-gap-mobile` | 12px |

## Component Dimensions

### Card Container

```css
.product-card {
    background-color: #FFFFFF;
    cursor: pointer;
    position: relative;
    transition: transform 0.2s ease;
}

.product-card:hover {
    transform: translateY(-2px);
}
```

### Image Container

```css
.card-image-container {
    position: relative;
    width: 100%;
    aspect-ratio: 3 / 4;
    background-color: #F5F5F5;
    overflow: hidden;
}

.card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: opacity 0.2s ease;
}

/* Hover image swap */
.card-image-hover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.product-card:hover .card-image-hover {
    opacity: 1;
}
```

### Favorite Button

```css
.favorite-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
    border: none;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.2s ease;
    z-index: 2;
}

.favorite-btn:hover {
    background-color: #FFFFFF;
    transform: scale(1.1);
}

.favorite-btn:focus {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

.favorite-btn svg {
    width: 20px;
    height: 20px;
    fill: none;
    stroke: #111111;
    stroke-width: 1.5;
}

.favorite-btn.active svg {
    fill: #111111;
}
```

### Badges

```css
.card-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    padding: 4px 8px;
    font-size: 12px;
    font-weight: 500;
    background-color: #FFFFFF;
    color: #111111;
    z-index: 2;
}

.card-badge.sale {
    background-color: #9E3500;
    color: #FFFFFF;
}

.card-badge.member {
    background-color: #111111;
    color: #FFFFFF;
}
```

### Card Info

```css
.card-info {
    padding: 12px;
}

.product-name {
    font-size: 16px;
    font-weight: 500;
    color: #111111;
    line-height: 1.4;
    margin-bottom: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.product-category {
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
    color: #111111;
}

.product-price.sale {
    color: #9E3500;
}

.original-price {
    color: #757575;
    text-decoration: line-through;
    font-weight: 400;
    margin-left: 8px;
}
```

### Sold Out State

```css
.sold-out-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
}

.sold-out-text {
    font-size: 14px;
    font-weight: 500;
    color: #111111;
    text-transform: uppercase;
    letter-spacing: 1px;
}
```

### Color Swatches

```css
.color-swatches {
    display: flex;
    gap: 6px;
    align-items: center;
    margin-bottom: 8px;
}

.color-swatch {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid #E5E5E5;
    cursor: pointer;
    transition: transform 0.15s ease;
}

.color-swatch:hover {
    transform: scale(1.1);
}

.color-swatch.active {
    border: 2px solid #111111;
}

.more-colors {
    font-size: 12px;
    color: #757575;
}
```

## Grid Layout

```css
.product-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
}

@media (max-width: 1024px) {
    .product-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 768px) {
    .product-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }
}

@media (max-width: 400px) {
    .product-grid {
        grid-template-columns: 1fr;
    }
}
```

## Spacing Diagram

```
Product Card Layout:

┌─────────────────────────────────────┐
│                                     │
│  Image Container (aspect-ratio: 3/4)│
│                                     │
│  ┌───────┐                   ┌────┐ │
│  │ Badge │ ← 12px margin     │ ♡  │ │ ← 12px from top/right
│  │ 4px 8px padding           │36px│ │
│  └───────┘                   └────┘ │
│                                     │
│                                     │
│                                     │
│                                     │
│                                     │
├─────────────────────────────────────┤
│ ▲                                   │
│ 12px padding                        │
│ ▼                                   │
│ ├─12px─┤ Product Name  ├─12px─┤     │
│         ▲                           │
│         4px margin                  │
│         ▼                           │
│         Category                    │
│         ▲                           │
│         4px margin                  │
│         ▼                           │
│         X Colors                    │
│         ▲                           │
│         8px margin                  │
│         ▼                           │
│         $XXX                        │
│ ▲                                   │
│ 12px padding                        │
│ ▼                                   │
└─────────────────────────────────────┘

Color Swatches:
┌────────────────────────────────────────┐
│ ●  ●  ●  ●  +5                         │
│ │  │                                   │
│ └──┘ 6px gap                           │
│ 16x16px swatch                         │
└────────────────────────────────────────┘
```

## Animation Specifications

| Property | Duration | Easing | Usage |
|----------|----------|--------|-------|
| Card transform | 200ms | ease | Hover lift effect |
| Image opacity | 200ms | ease | Image swap on hover |
| Favorite bg | 200ms | ease | Hover state |
| Favorite transform | 200ms | ease | Hover scale |
| Swatch transform | 150ms | ease | Hover scale |

## Interactive States

### Card Hover

```css
.product-card:hover {
    transform: translateY(-2px);
}

/* Optional shadow on hover */
.product-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

### Focus States

```css
.product-card:focus-within {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

.favorite-btn:focus-visible {
    outline: 2px solid #111111;
    outline-offset: 2px;
}
```

## Accessibility

```css
/* Visually hidden text for screen readers */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

/* Focus ring for keyboard navigation */
.product-card a:focus {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .product-card,
    .card-image,
    .card-image-hover,
    .favorite-btn,
    .color-swatch {
        transition: none;
    }
}
```

## Z-Index Stack

| Element | Z-Index |
|---------|---------|
| Card Image | 0 (default) |
| Sold Out Overlay | 1 |
| Badge | 2 |
| Favorite Button | 2 |
