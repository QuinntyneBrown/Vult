# Product Info Section - CSS Specification

## Design Tokens

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--info-text-primary` | `#111111` | Title, color name, current price |
| `--info-text-secondary` | `#757575` | Subtitle, original price |
| `--info-text-success` | `#008c00` | Sale badge, promotional text |
| `--info-badge-bg` | `#111111` | Member badge background |
| `--info-badge-text` | `#ffffff` | Member badge text |
| `--info-sale-bg` | `#008c00` | Sale badge background |
| `--info-sale-text` | `#ffffff` | Sale badge text |

### Typography
| Token | Value | Usage |
|-------|-------|-------|
| `--info-font-family` | `'Helvetica Neue', Helvetica, Arial, sans-serif` | All text |
| `--info-title-size` | `24px` | Product title (desktop) |
| `--info-title-size-mobile` | `20px` | Product title (mobile) |
| `--info-subtitle-size` | `16px` | Subtitle (desktop) |
| `--info-subtitle-size-mobile` | `14px` | Subtitle (mobile) |
| `--info-price-size` | `20px` | Current price (desktop) |
| `--info-price-size-mobile` | `18px` | Current price (mobile) |

### Spacing
| Token | Value | Usage |
|-------|-------|-------|
| `--info-badge-margin` | `12px` | Space below member badge |
| `--info-subtitle-margin` | `4px` | Space below subtitle |
| `--info-title-margin` | `12px` | Space below title |
| `--info-color-margin` | `16px` | Space below color name |
| `--info-price-gap` | `8px` | Gap between price elements |
| `--info-promo-margin` | `8px` | Space above promotional text |

---

## Component Styles

### Container
```css
.product-info-section {
  max-width: 400px;
  font-family: var(--info-font-family, 'Helvetica Neue', Helvetica, Arial, sans-serif);
}
```

### Member Badge
```css
.product-info__badge {
  display: inline-block;
  padding: 4px 8px;
  background-color: var(--info-badge-bg, #111111);
  color: var(--info-badge-text, #ffffff);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--info-badge-margin, 12px);
}
```

### Subtitle
```css
.product-info__subtitle {
  font-size: var(--info-subtitle-size, 16px);
  font-weight: 400;
  color: var(--info-text-secondary, #757575);
  line-height: 1.5;
  margin-bottom: var(--info-subtitle-margin, 4px);
}
```

### Title
```css
.product-info__title {
  font-size: var(--info-title-size, 24px);
  font-weight: 500;
  color: var(--info-text-primary, #111111);
  line-height: 1.3;
  margin-bottom: var(--info-title-margin, 12px);
}
```

### Color Name
```css
.product-info__color {
  font-size: 16px;
  font-weight: 400;
  color: var(--info-text-primary, #111111);
  line-height: 1.5;
  margin-bottom: var(--info-color-margin, 16px);
}
```

### Price Container
```css
.product-info__price-container {
  display: flex;
  align-items: center;
  gap: var(--info-price-gap, 8px);
  flex-wrap: wrap;
}
```

### Current Price
```css
.product-info__price {
  font-size: var(--info-price-size, 20px);
  font-weight: 500;
  color: var(--info-text-primary, #111111);
  line-height: 1.4;
}
```

### Original Price (Strikethrough)
```css
.product-info__price--original {
  font-size: 16px;
  font-weight: 400;
  color: var(--info-text-secondary, #757575);
  text-decoration: line-through;
}
```

### Sale Badge
```css
.product-info__sale-badge {
  display: inline-block;
  padding: 4px 8px;
  background-color: var(--info-sale-bg, #008c00);
  color: var(--info-sale-text, #ffffff);
  font-size: 12px;
  font-weight: 500;
  border-radius: 2px;
}
```

### Promotional Message
```css
.product-info__promo {
  margin-top: var(--info-promo-margin, 8px);
  font-size: 14px;
  color: var(--info-text-success, #008c00);
  font-weight: 500;
}
```

---

## Responsive Breakpoints

### Mobile (< 768px)
```css
@media (max-width: 768px) {
  .product-info__subtitle {
    font-size: var(--info-subtitle-size-mobile, 14px);
  }

  .product-info__title {
    font-size: var(--info-title-size-mobile, 20px);
  }

  .product-info__price {
    font-size: var(--info-price-size-mobile, 18px);
  }
}
```

---

## Accessibility

### Screen Reader Support
```css
/* Visually hidden but accessible */
.product-info__sr-only {
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
```

### Focus States
```css
.product-info__price-container a:focus {
  outline: 2px solid var(--info-text-primary, #111111);
  outline-offset: 2px;
}
```

---

## Spacing Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌─────────────────┐                                        │
│  │ MEMBER BADGE    │  padding: 4px 8px                      │
│  └─────────────────┘                                        │
│           │                                                 │
│           ▼ 12px margin-bottom                              │
│                                                             │
│  ───────────────────  SUBTITLE                              │
│           │           font-size: 16px                       │
│           ▼ 4px                                             │
│                                                             │
│  ═══════════════════  TITLE (H1)                            │
│           │           font-size: 24px                       │
│           ▼ 12px                                            │
│                                                             │
│  ───────────────────  COLOR NAME                            │
│           │           font-size: 16px                       │
│           ▼ 16px                                            │
│                                                             │
│  ┌───────┐ ◄─8px─► ┌───────┐ ◄─8px─► ┌─────────┐           │
│  │ $140  │         │ $175  │         │ 20% off │           │
│  └───────┘         └───────┘         └─────────┘           │
│   current           original          sale badge           │
│   20px              16px              12px                  │
│                                                             │
│           ▼ 8px (if promo exists)                          │
│                                                             │
│  ───────────────────  PROMO MESSAGE                         │
│                       font-size: 14px                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
