# Add to Bag Button - CSS Specification

## Design Tokens

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--atb-bg-default` | `#111111` | Default background |
| `--atb-bg-hover` | `#333333` | Hover background |
| `--atb-bg-success` | `#008c00` | Success state background |
| `--atb-bg-disabled` | `#cccccc` | Disabled background |
| `--atb-text-default` | `#ffffff` | Default text color |
| `--atb-text-disabled` | `#767676` | Disabled text color |
| `--atb-error-color` | `#d43f21` | Error message color |
| `--atb-spinner-track` | `rgba(255, 255, 255, 0.3)` | Spinner track |
| `--atb-spinner-accent` | `#ffffff` | Spinner accent |

### Typography
| Token | Value | Usage |
|-------|-------|-------|
| `--atb-font-family` | `'Helvetica Neue', Helvetica, Arial, sans-serif` | Button text |
| `--atb-font-size` | `16px` | Button text size |
| `--atb-font-weight` | `500` | Button text weight |
| `--atb-error-size` | `14px` | Error message size |

### Sizing
| Token | Value | Usage |
|-------|-------|-------|
| `--atb-height-desktop` | `60px` | Desktop button height |
| `--atb-height-mobile` | `52px` | Mobile button height |
| `--atb-border-radius` | `30px` | Pill shape radius |
| `--atb-icon-size` | `20px` | Icon dimensions |
| `--atb-spinner-size` | `24px` | Loading spinner size |
| `--atb-spinner-border` | `3px` | Spinner border width |

### Spacing
| Token | Value | Usage |
|-------|-------|-------|
| `--atb-padding-x` | `24px` | Horizontal padding |
| `--atb-icon-gap` | `8px` | Gap between icon and text |
| `--atb-error-gap` | `12px` | Gap above error message |
| `--atb-error-icon-gap` | `6px` | Gap in error message |

### Transitions
| Token | Value | Usage |
|-------|-------|-------|
| `--atb-transition-bg` | `0.2s ease` | Background color change |
| `--atb-transition-scale` | `0.1s ease` | Active scale transform |
| `--atb-spinner-speed` | `0.8s` | Spinner rotation speed |

---

## Component Styles

### Base Button
```css
.add-to-bag-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--atb-icon-gap, 8px);
  width: 100%;
  height: var(--atb-height-desktop, 60px);
  padding: 0 var(--atb-padding-x, 24px);
  background-color: var(--atb-bg-default, #111111);
  color: var(--atb-text-default, #ffffff);
  border: none;
  border-radius: var(--atb-border-radius, 30px);
  font-family: var(--atb-font-family, 'Helvetica Neue', Helvetica, Arial, sans-serif);
  font-size: var(--atb-font-size, 16px);
  font-weight: var(--atb-font-weight, 500);
  cursor: pointer;
  transition:
    background-color var(--atb-transition-bg, 0.2s ease),
    transform var(--atb-transition-scale, 0.1s ease);
  position: relative;
  white-space: nowrap;
}
```

### Hover State
```css
.add-to-bag-btn:hover:not(:disabled):not(.add-to-bag-btn--loading) {
  background-color: var(--atb-bg-hover, #333333);
}
```

### Active State
```css
.add-to-bag-btn:active:not(:disabled):not(.add-to-bag-btn--loading) {
  transform: scale(0.98);
}
```

### Focus State
```css
.add-to-bag-btn:focus {
  outline: 2px solid var(--atb-bg-default, #111111);
  outline-offset: 2px;
}

.add-to-bag-btn:focus:not(:focus-visible) {
  outline: none;
}

.add-to-bag-btn:focus-visible {
  outline: 2px solid var(--atb-bg-default, #111111);
  outline-offset: 2px;
}
```

### Disabled State
```css
.add-to-bag-btn:disabled {
  background-color: var(--atb-bg-disabled, #cccccc);
  color: var(--atb-text-disabled, #767676);
  cursor: not-allowed;
}

.add-to-bag-btn:disabled:hover {
  background-color: var(--atb-bg-disabled, #cccccc);
}

.add-to-bag-btn:disabled:active {
  transform: none;
}
```

### Loading State
```css
.add-to-bag-btn--loading {
  color: transparent;
  pointer-events: none;
}

.add-to-bag-btn--loading::after {
  content: '';
  position: absolute;
  width: var(--atb-spinner-size, 24px);
  height: var(--atb-spinner-size, 24px);
  border: var(--atb-spinner-border, 3px) solid var(--atb-spinner-track, rgba(255, 255, 255, 0.3));
  border-top-color: var(--atb-spinner-accent, #ffffff);
  border-radius: 50%;
  animation: atb-spin var(--atb-spinner-speed, 0.8s) linear infinite;
}

@keyframes atb-spin {
  to {
    transform: rotate(360deg);
  }
}
```

### Success State
```css
.add-to-bag-btn--success {
  background-color: var(--atb-bg-success, #008c00);
}

.add-to-bag-btn--success:hover {
  background-color: #007a00;
}
```

### Icon Styles
```css
.add-to-bag-btn__icon {
  width: var(--atb-icon-size, 20px);
  height: var(--atb-icon-size, 20px);
  flex-shrink: 0;
  fill: currentColor;
}

.add-to-bag-btn__check {
  width: var(--atb-icon-size, 20px);
  height: var(--atb-icon-size, 20px);
  stroke: currentColor;
  stroke-width: 3;
  fill: none;
}
```

### Error Message
```css
.add-to-bag-error {
  display: flex;
  align-items: center;
  gap: var(--atb-error-icon-gap, 6px);
  margin-top: var(--atb-error-gap, 12px);
  color: var(--atb-error-color, #d43f21);
  font-size: var(--atb-error-size, 14px);
  font-family: var(--atb-font-family, 'Helvetica Neue', Helvetica, Arial, sans-serif);
}

.add-to-bag-error__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  fill: currentColor;
}
```

---

## Responsive Styles

```css
@media (max-width: 768px) {
  .add-to-bag-btn {
    height: var(--atb-height-mobile, 52px);
  }
}
```

---

## Accessibility

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .add-to-bag-btn {
    transition: none;
  }

  .add-to-bag-btn:active:not(:disabled):not(.add-to-bag-btn--loading) {
    transform: none;
  }

  .add-to-bag-btn--loading::after {
    animation: none;
    border-top-color: var(--atb-spinner-track, rgba(255, 255, 255, 0.3));
    border-right-color: var(--atb-spinner-accent, #ffffff);
  }
}
```

### High Contrast
```css
@media (prefers-contrast: high) {
  .add-to-bag-btn:focus {
    outline-width: 3px;
  }

  .add-to-bag-btn:disabled {
    border: 2px solid #767676;
  }
}
```

### Minimum Touch Target
```css
.add-to-bag-btn {
  min-height: 44px;
  min-width: 44px;
}
```

---

## Spacing Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ╔═════════════════════════════════════════════════════════════════════╗    │
│  ║                                                                     ║    │
│  ║   ◄── 24px ──►  ┌────┐ ◄─ 8px ─► Add to Bag  ◄── 24px ──►         ║    │
│  ║      padding    │icon│    gap      text          padding            ║    │
│  ║                 │20px│                                              ║    │
│  ║                 └────┘                                              ║    │
│  ║                                                                     ║    │
│  ║                           ▲                                         ║    │
│  ║                       60px│ height (desktop)                        ║    │
│  ║                       52px│ height (mobile)                         ║    │
│  ║                           ▼                                         ║    │
│  ║                                                                     ║    │
│  ╚═════════════════════════════════════════════════════════════════════╝    │
│                                                                             │
│  border-radius: 30px (pill shape)                                           │
│                                                                             │
│  ◄──────────────────────── 100% width ────────────────────────────────►    │
│                                                                             │
│                           ▲                                                 │
│                        12px│ error margin-top                               │
│                           ▼                                                 │
│  ┌────┐ ◄─ 6px ─► Error message text                                       │
│  │16px│           14px font-size                                            │
│  └────┘                                                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

Loading Spinner:
┌─────────────────────────────────────────┐
│                                         │
│              ┌─────────┐                │
│              │   ◠     │ 24px diameter  │
│              │  /      │ 3px border     │
│              └─────────┘                │
│                                         │
│    Centered absolutely in button        │
│    Animation: 0.8s linear infinite      │
│                                         │
└─────────────────────────────────────────┘
```
