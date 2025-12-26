# Product Grid CSS Specification

## Design Tokens

### Spacing

| Token | Desktop | Tablet | Mobile |
|-------|---------|--------|--------|
| `--grid-gap` | 16px | 12px | 12px |
| `--grid-padding` | 0 | 0 | 12px |
| `--grid-columns` | 4 | 3 | 2 |

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--skeleton-bg` | `#F5F5F5` | Skeleton placeholder |
| `--skeleton-shimmer` | `#E5E5E5` | Shimmer animation |
| `--empty-state-text` | `#757575` | Empty state message |

## Component Structure

### Grid Container

```css
.product-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    width: 100%;
}

@media (max-width: 1200px) {
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

@media (max-width: 480px) {
    .product-grid--single-column {
        grid-template-columns: 1fr;
    }
}
```

### Grid with Sidebar Layout

```css
.product-listing {
    display: flex;
    gap: 16px;
}

.product-listing__sidebar {
    width: 260px;
    flex-shrink: 0;
}

.product-listing__content {
    flex: 1;
    min-width: 0;
}

@media (max-width: 768px) {
    .product-listing {
        flex-direction: column;
    }

    .product-listing__sidebar {
        display: none;
    }
}
```

### Loading State (Skeleton)

```css
.product-grid--loading .product-card-skeleton {
    background-color: #F5F5F5;
    position: relative;
    overflow: hidden;
}

.product-card-skeleton__image {
    aspect-ratio: 3 / 4;
    background-color: #F5F5F5;
}

.product-card-skeleton__text {
    height: 16px;
    background-color: #E5E5E5;
    margin: 8px 12px;
    border-radius: 4px;
}

.product-card-skeleton__text--short {
    width: 60%;
}

.product-card-skeleton__text--medium {
    width: 80%;
}

/* Shimmer animation */
.product-card-skeleton::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.5),
        transparent
    );
    animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
    0% {
        left: -100%;
    }
    100% {
        left: 100%;
    }
}
```

### Empty State

```css
.product-grid__empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 80px 24px;
}

.product-grid__empty-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 24px;
    opacity: 0.5;
}

.product-grid__empty-title {
    font-size: 18px;
    font-weight: 500;
    color: #111111;
    margin-bottom: 8px;
}

.product-grid__empty-message {
    font-size: 14px;
    color: #757575;
    margin-bottom: 24px;
}

.product-grid__empty-action {
    display: inline-block;
    padding: 12px 24px;
    background-color: #111111;
    color: #FFFFFF;
    text-decoration: none;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 500;
}

.product-grid__empty-action:hover {
    background-color: #757575;
}
```

## Complete CSS

```css
/* Product Grid Layout */
.product-listing {
    display: flex;
    gap: 16px;
}

.product-listing__sidebar {
    width: 260px;
    flex-shrink: 0;
}

.product-listing__content {
    flex: 1;
    min-width: 0;
}

/* Product Grid */
.product-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    width: 100%;
}

/* Responsive Grid */
@media (max-width: 1200px) {
    .product-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 768px) {
    .product-listing {
        flex-direction: column;
    }

    .product-listing__sidebar {
        display: none;
    }

    .product-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        padding: 0 12px;
    }
}

@media (max-width: 480px) {
    .product-grid--single-column {
        grid-template-columns: 1fr;
    }
}

/* Loading Skeleton */
.product-card-skeleton {
    background-color: #FFFFFF;
    position: relative;
    overflow: hidden;
}

.product-card-skeleton__image {
    aspect-ratio: 3 / 4;
    background-color: #F5F5F5;
}

.product-card-skeleton__content {
    padding: 12px;
}

.product-card-skeleton__text {
    height: 16px;
    background-color: #E5E5E5;
    margin-bottom: 8px;
    border-radius: 4px;
}

.product-card-skeleton__text--title {
    width: 80%;
}

.product-card-skeleton__text--category {
    width: 50%;
    height: 14px;
}

.product-card-skeleton__text--price {
    width: 30%;
    margin-top: 16px;
}

.product-card-skeleton::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.5),
        transparent
    );
    animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
}

/* Empty State */
.product-grid__empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 80px 24px;
}

.product-grid__empty-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 24px;
    opacity: 0.5;
}

.product-grid__empty-title {
    font-size: 18px;
    font-weight: 500;
    color: #111111;
    margin-bottom: 8px;
}

.product-grid__empty-message {
    font-size: 14px;
    color: #757575;
    margin-bottom: 24px;
}

.product-grid__empty-action {
    display: inline-block;
    padding: 12px 24px;
    background-color: #111111;
    color: #FFFFFF;
    text-decoration: none;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.2s ease;
}

.product-grid__empty-action:hover {
    background-color: #757575;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .product-card-skeleton::after {
        animation: none;
    }
}
```

## Spacing Diagram

```
Product Grid Layout:

┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│ display: grid                                                              │
│ grid-template-columns: repeat(4, 1fr)                                      │
│ gap: 16px                                                                  │
│                                                                            │
│ ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐│
│ │               │  │               │  │               │  │               ││
│ │   1fr         │  │   1fr         │  │   1fr         │  │   1fr         ││
│ │               │  │               │  │               │  │               ││
│ └───────────────┘  └───────────────┘  └───────────────┘  └───────────────┘│
│       ├──16px──┤         ├──16px──┤         ├──16px──┤                    │
│                                                                            │
│ ├────────────────16px row gap────────────────┤                             │
│                                                                            │
│ ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐│
│ │               │  │               │  │               │  │               ││
│ │   1fr         │  │   1fr         │  │   1fr         │  │   1fr         ││
│ │               │  │               │  │               │  │               ││
│ └───────────────┘  └───────────────┘  └───────────────┘  └───────────────┘│
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

With Sidebar:

┌──────────┬────────────────────────────────────────────────────────────────┐
│          │                                                                │
│  260px   │  flex: 1 (remaining width)                                     │
│  sidebar │                                                                │
│          │  Grid adjusts columns based on available width                 │
│          │                                                                │
├──16px────┤                                                                │
│   gap    │                                                                │
└──────────┴────────────────────────────────────────────────────────────────┘
```

## Animation Specifications

| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| Shimmer | 1500ms | linear | Loading skeleton |
| Layout shift | 200ms | ease | Grid resize |
