# Primary Button CSS Specification

## Design Tokens

### Colors - Dark Theme (Default)

| Token | Value | Usage |
|-------|-------|-------|
| `--btn-primary-bg` | `#111111` | Background color |
| `--btn-primary-bg-hover` | `#333333` | Hover background |
| `--btn-primary-text` | `#FFFFFF` | Text color |
| `--btn-primary-disabled-bg` | `#CCCCCC` | Disabled background |
| `--btn-primary-disabled-text` | `#767676` | Disabled text |
| `--btn-focus-ring` | `#111111` | Focus outline color |

### Colors - Light Theme (Inverse)

| Token | Value | Usage |
|-------|-------|-------|
| `--btn-primary-light-bg` | `#FFFFFF` | Background color |
| `--btn-primary-light-bg-hover` | `#E5E5E5` | Hover background |
| `--btn-primary-light-text` | `#111111` | Text color |

### Typography

| Element | Font Family | Size | Weight | Line Height |
|---------|-------------|------|--------|-------------|
| Small | Helvetica Neue | 14px | 500 | 1 |
| Medium | Helvetica Neue | 16px | 500 | 1 |
| Large | Helvetica Neue | 16px | 500 | 1 |

### Dimensions

| Size | Height | Padding | Border Radius |
|------|--------|---------|---------------|
| Small | 36px | 0 20px | 30px |
| Medium | 44px | 0 24px | 30px |
| Large | 52px | 0 32px | 30px |

### Spacing

| Token | Value |
|-------|-------|
| `--btn-icon-gap` | 8px |
| `--btn-focus-offset` | 2px |
| `--btn-icon-size` | 18px |
| `--btn-loader-size` | 20px |

## Base Component

```css
.btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 500;
    text-decoration: none;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    white-space: nowrap;
    transition: background-color 0.2s ease, transform 0.1s ease;
}
```

## Theme Variants

### Dark Theme (Default)

```css
.btn-primary.dark {
    background-color: #111111;
    color: #FFFFFF;
}

.btn-primary.dark:hover {
    background-color: #333333;
}
```

### Light Theme (Inverse)

```css
.btn-primary.light {
    background-color: #FFFFFF;
    color: #111111;
}

.btn-primary.light:hover {
    background-color: #E5E5E5;
}
```

## Size Variants

```css
.btn-primary.small {
    height: 36px;
    padding: 0 20px;
    font-size: 14px;
}

.btn-primary.medium {
    height: 44px;
    padding: 0 24px;
    font-size: 16px;
}

.btn-primary.large {
    height: 52px;
    padding: 0 32px;
    font-size: 16px;
}
```

## Width Variants

```css
/* Auto width (default) */
.btn-primary {
    width: auto;
}

/* Full width */
.btn-primary.full-width {
    width: 100%;
}
```

## Interactive States

### Focus State

```css
.btn-primary:focus {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

.btn-primary:focus:not(:focus-visible) {
    outline: none;
}

.btn-primary:focus-visible {
    outline: 2px solid #111111;
    outline-offset: 2px;
}
```

### Active/Pressed State

```css
.btn-primary:active {
    transform: scale(0.95);
}
```

### Disabled State

```css
.btn-primary:disabled,
.btn-primary.disabled {
    background-color: #CCCCCC;
    color: #767676;
    cursor: not-allowed;
}

.btn-primary:disabled:hover,
.btn-primary.disabled:hover {
    background-color: #CCCCCC;
}

.btn-primary:disabled:active,
.btn-primary.disabled:active {
    transform: none;
}
```

### Loading State

```css
.btn-primary.loading {
    position: relative;
    color: transparent;
    pointer-events: none;
}

.btn-primary.loading::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid #FFFFFF;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

.btn-primary.loading.light::after {
    border-color: #111111;
    border-top-color: transparent;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
```

## Icons

```css
.btn-primary svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
    flex-shrink: 0;
}
```

## Spacing Diagram

```
Button Anatomy (Medium Size):

┌────────────────────────────────────────────────────────────┐
│                                                            │
│  ├─────── 24px ───────┤  Button Text  ├────── 24px ──────┤│
│                                                            │
│  ▲                        44px height                  ▲   │
│  │                                                     │   │
│  └─────────────────── centered vertically ─────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
Border-radius: 30px (pill shape)


With Icon:

┌────────────────────────────────────────────────────────────┐
│                                                            │
│  ├─24px─┤ [Icon] ├─8px─┤ Button Text ├─────── 24px ───────┤│
│           18x18                                            │
│                                                            │
└────────────────────────────────────────────────────────────┘


Focus Ring:

┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│                                                     │  ← 2px outline
  ├─ 2px offset ─┤
│ ┌─────────────────────────────────────────────────┐ │
  │                                                 │
│ │               Button Text                       │ │
  │                                                 │
│ └─────────────────────────────────────────────────┘ │

└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

## Animation Specifications

| Property | Duration | Easing | Usage |
|----------|----------|--------|-------|
| background-color | 200ms | ease | Hover transition |
| transform | 100ms | ease | Active press |
| spinner rotation | 800ms | linear | Loading state |

## Touch Target

```css
/* Ensure minimum touch target size */
.btn-primary {
    min-height: 44px; /* WCAG minimum */
    min-width: 44px;
}

/* For smaller visual buttons, use pseudo-element for touch area */
.btn-primary.small {
    position: relative;
}

.btn-primary.small::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 44px;
    min-width: 44px;
}
```

## Accessibility

```css
/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
    .btn-primary {
        transition: none;
    }

    .btn-primary:active {
        transform: none;
    }

    .btn-primary.loading::after {
        animation: none;
    }
}

/* High contrast mode */
@media (prefers-contrast: high) {
    .btn-primary:focus {
        outline: 3px solid currentColor;
    }
}
```

## Usage Examples

```html
<!-- Standard button -->
<button class="btn-primary dark medium">Shop Now</button>

<!-- Link as button -->
<a href="/shop" class="btn-primary dark medium">Shop Now</a>

<!-- With icon -->
<button class="btn-primary dark medium">
    <svg>...</svg>
    Add to Bag
</button>

<!-- Full width -->
<button class="btn-primary dark large full-width">Add to Bag</button>

<!-- Disabled -->
<button class="btn-primary dark medium" disabled>Sold Out</button>

<!-- Loading -->
<button class="btn-primary dark medium loading">Adding...</button>
```

## Z-Index

| Element | Z-Index |
|---------|---------|
| Button (default) | auto |
| Loading spinner | 1 |
| Focus ring | auto (outline) |
