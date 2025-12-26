# Size Selector PDP - CSS Specification

## Design Tokens

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--size-text-primary` | `#111111` | Label, button text |
| `--size-text-secondary` | `#757575` | Size guide link hover |
| `--size-text-disabled` | `#cccccc` | Unavailable size text |
| `--size-border-default` | `#e5e5e5` | Default button border |
| `--size-border-hover` | `#111111` | Hover/selected border |
| `--size-border-error` | `#d43f21` | Error state border |
| `--size-bg-default` | `#ffffff` | Button background |
| `--size-text-error` | `#d43f21` | Error text, low stock |

### Typography
| Token | Value | Usage |
|-------|-------|-------|
| `--size-font-family` | `'Helvetica Neue', Helvetica, Arial, sans-serif` | All text |
| `--size-label-size` | `16px` | Header label |
| `--size-button-size` | `16px` | Size button text |
| `--size-guide-size` | `14px` | Size guide link |
| `--size-stock-size` | `10px` | Low stock indicator |
| `--size-error-size` | `14px` | Error message |

### Spacing
| Token | Value | Usage |
|-------|-------|-------|
| `--size-header-gap` | `12px` | Gap below header |
| `--size-grid-gap` | `8px` | Gap between buttons |
| `--size-error-gap` | `12px` | Gap above error message |
| `--size-error-icon-gap` | `6px` | Gap between error icon and text |

### Sizing
| Token | Value | Usage |
|-------|-------|-------|
| `--size-button-height` | `48px` | Button height |
| `--size-button-radius` | `4px` | Button border radius |
| `--size-error-icon-size` | `16px` | Error icon dimensions |

---

## Component Styles

### Container
```css
.size-selector-pdp {
  max-width: 400px;
  font-family: var(--size-font-family, 'Helvetica Neue', Helvetica, Arial, sans-serif);
}
```

### Header
```css
.size-selector__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--size-header-gap, 12px);
}

.size-selector__label {
  font-size: var(--size-label-size, 16px);
  font-weight: 500;
  color: var(--size-text-primary, #111111);
}

.size-selector__guide-link {
  font-size: var(--size-guide-size, 14px);
  color: var(--size-text-primary, #111111);
  text-decoration: underline;
  cursor: pointer;
  background: none;
  border: none;
  font-family: inherit;
  padding: 0;
  transition: color 0.15s ease;
}

.size-selector__guide-link:hover {
  color: var(--size-text-secondary, #757575);
}

.size-selector__guide-link:focus {
  outline: 2px solid var(--size-text-primary, #111111);
  outline-offset: 2px;
}
```

### Grid Layout
```css
.size-selector__grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--size-grid-gap, 8px);
}

@media (max-width: 480px) {
  .size-selector__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Size Button
```css
.size-button {
  height: var(--size-button-height, 48px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--size-bg-default, #ffffff);
  border: 1px solid var(--size-border-default, #e5e5e5);
  border-radius: var(--size-button-radius, 4px);
  font-family: inherit;
  font-size: var(--size-button-size, 16px);
  color: var(--size-text-primary, #111111);
  cursor: pointer;
  transition: border-color 0.15s ease;
  position: relative;
  padding: 0;
}

.size-button:hover:not(.size-button--unavailable) {
  border-color: var(--size-border-hover, #111111);
}

.size-button:focus {
  outline: 2px solid var(--size-text-primary, #111111);
  outline-offset: 2px;
}

.size-button:focus:not(:focus-visible) {
  outline: none;
}

.size-button:focus-visible {
  outline: 2px solid var(--size-text-primary, #111111);
  outline-offset: 2px;
}
```

### Size Button States
```css
/* Selected State */
.size-button--selected {
  border: 1.5px solid var(--size-border-hover, #111111);
}

/* Unavailable State */
.size-button--unavailable {
  color: var(--size-text-disabled, #cccccc);
  cursor: not-allowed;
}

.size-button--unavailable:hover {
  border-color: var(--size-border-default, #e5e5e5);
}

.size-button--unavailable::after {
  content: '';
  position: absolute;
  top: 50%;
  left: -5%;
  width: 110%;
  height: 1px;
  background-color: var(--size-text-disabled, #cccccc);
  transform: rotate(-20deg);
  pointer-events: none;
}

/* Error State */
.size-button--error {
  border-color: var(--size-border-error, #d43f21);
}
```

### Low Stock Indicator
```css
.size-button__label {
  font-size: var(--size-button-size, 16px);
  line-height: 1;
}

.size-button__stock {
  font-size: var(--size-stock-size, 10px);
  color: var(--size-text-error, #d43f21);
  margin-top: 2px;
  line-height: 1;
}
```

### Error Message
```css
.size-selector__error {
  display: flex;
  align-items: center;
  gap: var(--size-error-icon-gap, 6px);
  margin-top: var(--size-error-gap, 12px);
  color: var(--size-text-error, #d43f21);
  font-size: var(--size-error-size, 14px);
}

.size-selector__error-icon {
  width: var(--size-error-icon-size, 16px);
  height: var(--size-error-icon-size, 16px);
  flex-shrink: 0;
}
```

---

## Accessibility

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .size-button,
  .size-selector__guide-link {
    transition: none;
  }
}
```

### High Contrast
```css
@media (prefers-contrast: high) {
  .size-button {
    border-width: 2px;
  }

  .size-button--selected {
    border-width: 3px;
  }
}
```

---

## Spacing Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Select Size                                      Size Guide       │  │
│  │  ↑ 16px font-weight: 500           14px underlined ↑             │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                    ▲                                    │
│                                 12px│ margin-bottom                     │
│                                    ▼                                    │
│  ┌─────────┐ ◄─ 8px ─► ┌─────────┐ ◄─ 8px ─► ┌─────────┐               │
│  │         │           │         │           │         │                │
│  │ 48px    │           │ 48px    │           │ 48px    │ 5 columns     │
│  │ height  │           │ height  │           │ height  │                │
│  │         │           │         │           │         │                │
│  └─────────┘           └─────────┘           └─────────┘                │
│       ▲                                                                 │
│    8px│ row gap                                                         │
│       ▼                                                                 │
│  ┌─────────┐                                                           │
│  │         │                                                           │
│  │         │                                                           │
│  └─────────┘                                                           │
│                                    ▲                                    │
│                                 12px│ error margin-top                  │
│                                    ▼                                    │
│  ┌────┐ ◄─ 6px ─► Please select a size                                 │
│  │icon│           14px error text                                       │
│  │16px│                                                                │
│  └────┘                                                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

Button Internal Spacing:
┌─────────────────────────────────────────┐
│                                         │
│              ┌───────────────┐          │
│              │     Size      │ 16px     │
│              │   Low Stock   │ 10px     │
│              └───────────────┘          │
│              2px gap between lines      │
│                                         │
│         48px total height               │
│         vertically centered             │
│                                         │
└─────────────────────────────────────────┘
```
