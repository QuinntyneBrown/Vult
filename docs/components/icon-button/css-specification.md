# Icon Button CSS Specification

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--icon-btn-bg` | `#E5E5E5` | Filled background |
| `--icon-btn-bg-hover` | `#CCCCCC` | Filled hover |
| `--icon-btn-bg-dark` | `#111111` | Dark filled background |
| `--icon-btn-bg-dark-hover` | `#333333` | Dark filled hover |
| `--icon-btn-icon` | `#111111` | Icon color |
| `--icon-btn-icon-light` | `#FFFFFF` | Light icon color |
| `--icon-btn-disabled-bg` | `#F5F5F5` | Disabled background |
| `--icon-btn-disabled-icon` | `#CCCCCC` | Disabled icon |
| `--badge-bg` | `#111111` | Badge background |
| `--badge-text` | `#FFFFFF` | Badge text |

### Dimensions

| Size | Button | Icon | Touch Target |
|------|--------|------|--------------|
| Small | 32px | 16px | 44px (pseudo) |
| Medium | 40px | 20px | 40px |
| Large | 48px | 24px | 48px |

### Spacing

| Token | Value |
|-------|-------|
| `--focus-offset` | 2px |
| `--focus-width` | 2px |
| `--badge-offset` | 0 (top-right aligned) |

## Base Component

```css
.icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.1s ease;
    position: relative;
}

.icon-btn svg {
    fill: currentColor;
    flex-shrink: 0;
}

.icon-btn:focus {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

.icon-btn:active {
    transform: scale(0.95);
}
```

## Size Variants

```css
.icon-btn.small {
    width: 32px;
    height: 32px;
}

.icon-btn.small svg {
    width: 16px;
    height: 16px;
}

/* Touch target for small buttons */
.icon-btn.small::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 44px;
    height: 44px;
}

.icon-btn.medium {
    width: 40px;
    height: 40px;
}

.icon-btn.medium svg {
    width: 20px;
    height: 20px;
}

.icon-btn.large {
    width: 48px;
    height: 48px;
}

.icon-btn.large svg {
    width: 24px;
    height: 24px;
}
```

## Style Variants

### Filled

```css
.icon-btn.filled {
    background-color: #E5E5E5;
    color: #111111;
}

.icon-btn.filled:hover {
    background-color: #CCCCCC;
}

/* Dark filled */
.icon-btn.filled.dark {
    background-color: #111111;
    color: #FFFFFF;
}

.icon-btn.filled.dark:hover {
    background-color: #333333;
}
```

### Ghost

```css
.icon-btn.ghost {
    background-color: transparent;
    color: #111111;
}

.icon-btn.ghost:hover {
    background-color: #E5E5E5;
}
```

### Outlined

```css
.icon-btn.outlined {
    background-color: transparent;
    color: #111111;
    border: 1.5px solid #111111;
}

.icon-btn.outlined:hover {
    background-color: rgba(0, 0, 0, 0.05);
}
```

## States

### Disabled

```css
.icon-btn:disabled,
.icon-btn.disabled {
    cursor: not-allowed;
    color: #CCCCCC;
}

.icon-btn.filled:disabled {
    background-color: #F5F5F5;
}

.icon-btn.filled:disabled:hover {
    background-color: #F5F5F5;
}

.icon-btn.outlined:disabled {
    border-color: #CCCCCC;
}

.icon-btn.ghost:disabled:hover {
    background-color: transparent;
}

.icon-btn:disabled:active {
    transform: none;
}
```

### Toggle Active

```css
.icon-btn.active svg {
    fill: #111111;
}

/* For outline icons that need to be filled when active */
.icon-btn.active svg path {
    fill: currentColor;
    stroke: none;
}
```

## Light Theme

```css
.icon-btn.filled.light {
    background-color: #FFFFFF;
    color: #111111;
}

.icon-btn.filled.light:hover {
    background-color: #E5E5E5;
}

.icon-btn.ghost.light {
    color: #FFFFFF;
}

.icon-btn.ghost.light:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.icon-btn.outlined.light {
    color: #FFFFFF;
    border-color: #FFFFFF;
}

.icon-btn.outlined.light:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.icon-btn.ghost.light:focus,
.icon-btn.outlined.light:focus {
    outline-color: #FFFFFF;
}
```

## Badge

```css
.icon-btn .badge {
    position: absolute;
    top: 0;
    right: 0;
    min-width: 16px;
    height: 16px;
    background-color: #111111;
    color: #FFFFFF;
    font-size: 10px;
    font-weight: 500;
    font-family: "Helvetica Neue", sans-serif;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    line-height: 1;
}

/* Larger badge for double digits */
.icon-btn .badge.large {
    min-width: 20px;
    height: 18px;
    padding: 0 5px;
}
```

## Spacing Diagram

```
Icon Button (Medium 40px):

┌────────────────────────────────────┐
│                                    │
│            ┌──────────┐            │
│            │          │            │
│            │   SVG    │            │  Icon centered
│            │  20x20   │            │
│            │          │            │
│            └──────────┘            │
│                                    │
└────────────────────────────────────┘
              ↑── 40px ──↑

Border-radius: 50% (perfect circle)


With Badge:

┌────────────────────────────────────┐
│                           ┌──────┐ │
│                           │ 16px │ │  Badge position:
│            ┌──────────┐   └──────┘ │  top: 0, right: 0
│            │   SVG    │            │
│            └──────────┘            │
│                                    │
└────────────────────────────────────┘


Focus Ring:

┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│                         │  ← 2px outline
  ├─2px offset─┤
│ ┌─────────────────────┐ │
  │                     │
│ │        ICON         │ │
  │                     │
│ └─────────────────────┘ │

└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
   outline-radius follows button shape
```

## Animation Specifications

| Property | Duration | Easing | Usage |
|----------|----------|--------|-------|
| background-color | 200ms | ease | Hover transition |
| transform | 100ms | ease | Active press |

## Accessibility

```css
/* Screen reader only text for context */
.icon-btn .sr-only {
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

/* Focus visible */
.icon-btn:focus-visible {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

.icon-btn:focus:not(:focus-visible) {
    outline: none;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .icon-btn {
        transition: none;
    }

    .icon-btn:active {
        transform: none;
    }
}
```

## ARIA Requirements

```html
<!-- Simple action -->
<button class="icon-btn" aria-label="Close dialog">
    <svg>...</svg>
</button>

<!-- Toggle button -->
<button class="icon-btn" aria-label="Add to favorites" aria-pressed="false">
    <svg>...</svg>
</button>

<!-- With badge count -->
<button class="icon-btn" aria-label="Shopping bag, 2 items">
    <svg>...</svg>
    <span class="badge" aria-hidden="true">2</span>
</button>
```

## Usage Examples

```html
<!-- Filled medium -->
<button class="icon-btn filled medium" aria-label="Favorite">
    <svg>...</svg>
</button>

<!-- Ghost with badge -->
<button class="icon-btn ghost medium" aria-label="Cart, 3 items">
    <svg>...</svg>
    <span class="badge">3</span>
</button>

<!-- Outlined light on dark background -->
<button class="icon-btn outlined light medium" aria-label="Close">
    <svg>...</svg>
</button>

<!-- Disabled -->
<button class="icon-btn filled medium" aria-label="Favorite" disabled>
    <svg>...</svg>
</button>

<!-- Toggle active -->
<button class="icon-btn filled medium active" aria-label="Favorited" aria-pressed="true">
    <svg>...</svg>
</button>
```
