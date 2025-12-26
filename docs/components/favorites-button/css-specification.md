# Favorites Button - CSS Specification

## Design Tokens

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--fav-icon-color` | `#111111` | Heart icon color |
| `--fav-border-default` | `#e5e5e5` | Icon-only border |
| `--fav-border-hover` | `#111111` | Border on hover |
| `--fav-bg-hover` | `#f5f5f5` | Icon-only hover bg |
| `--fav-full-border` | `#cccccc` | Full-width border |
| `--fav-text-color` | `#111111` | Button text color |
| `--fav-spinner-track` | `#e5e5e5` | Loading spinner track |
| `--fav-spinner-accent` | `#111111` | Loading spinner accent |

### Sizing
| Token | Value | Usage |
|-------|-------|-------|
| `--fav-icon-btn-size` | `48px` | Icon-only button size |
| `--fav-full-height` | `60px` | Full-width button height |
| `--fav-icon-size` | `24px` | Heart icon size |
| `--fav-full-radius` | `30px` | Full-width border radius |
| `--fav-spinner-size` | `20px` | Loading spinner size |

### Typography
| Token | Value | Usage |
|-------|-------|-------|
| `--fav-font-family` | `'Helvetica Neue', Helvetica, Arial, sans-serif` | Button text |
| `--fav-font-size` | `16px` | Button text size |
| `--fav-font-weight` | `500` | Button text weight |

### Spacing
| Token | Value | Usage |
|-------|-------|-------|
| `--fav-full-padding` | `24px` | Full-width horizontal padding |
| `--fav-icon-gap` | `8px` | Gap between icon and text |

### Transitions
| Token | Value | Usage |
|-------|-------|-------|
| `--fav-transition` | `0.15s ease` | General transitions |
| `--fav-animation-duration` | `0.3s` | Heart pop animation |
| `--fav-spinner-speed` | `0.8s` | Loading spinner speed |

---

## Component Styles

### Icon-Only Button
```css
.favorites-btn {
  width: var(--fav-icon-btn-size, 48px);
  height: var(--fav-icon-btn-size, 48px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: 1px solid var(--fav-border-default, #e5e5e5);
  border-radius: 50%;
  cursor: pointer;
  transition:
    background-color var(--fav-transition, 0.15s ease),
    transform var(--fav-transition, 0.15s ease),
    border-color var(--fav-transition, 0.15s ease);
  padding: 0;
}

.favorites-btn:hover {
  background-color: var(--fav-bg-hover, #f5f5f5);
}

.favorites-btn:active {
  transform: scale(0.95);
}

.favorites-btn:focus {
  outline: 2px solid var(--fav-icon-color, #111111);
  outline-offset: 2px;
}

.favorites-btn:focus:not(:focus-visible) {
  outline: none;
}

.favorites-btn:focus-visible {
  outline: 2px solid var(--fav-icon-color, #111111);
  outline-offset: 2px;
}
```

### Heart Icon
```css
.favorites-btn__icon {
  width: var(--fav-icon-size, 24px);
  height: var(--fav-icon-size, 24px);
  stroke: var(--fav-icon-color, #111111);
  fill: none;
  stroke-width: 1.5;
  transition: transform var(--fav-transition, 0.15s ease);
}

/* Favorited State */
.favorites-btn--favorited .favorites-btn__icon {
  fill: var(--fav-icon-color, #111111);
  stroke: var(--fav-icon-color, #111111);
}
```

### Heart Animation
```css
.favorites-btn--animating .favorites-btn__icon {
  animation: heart-pop var(--fav-animation-duration, 0.3s) ease;
}

@keyframes heart-pop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
```

### Full-Width Button
```css
.favorites-btn--full {
  width: 100%;
  height: var(--fav-full-height, 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--fav-icon-gap, 8px);
  background-color: #ffffff;
  border: 1.5px solid var(--fav-full-border, #cccccc);
  border-radius: var(--fav-full-radius, 30px);
  font-family: var(--fav-font-family, 'Helvetica Neue', Helvetica, Arial, sans-serif);
  font-size: var(--fav-font-size, 16px);
  font-weight: var(--fav-font-weight, 500);
  color: var(--fav-text-color, #111111);
  cursor: pointer;
  transition:
    border-color var(--fav-transition, 0.15s ease),
    transform 0.1s ease;
  padding: 0 var(--fav-full-padding, 24px);
}

.favorites-btn--full:hover {
  border-color: var(--fav-border-hover, #111111);
}

.favorites-btn--full:active {
  transform: scale(0.98);
}

.favorites-btn--full:focus {
  outline: 2px solid var(--fav-icon-color, #111111);
  outline-offset: 2px;
}

.favorites-btn--full.favorites-btn--favorited {
  border-color: var(--fav-border-hover, #111111);
}

.favorites-btn--full .favorites-btn__icon {
  flex-shrink: 0;
}
```

### Loading State
```css
.favorites-btn--loading .favorites-btn__icon {
  display: none;
}

.favorites-btn--loading::after {
  content: '';
  width: var(--fav-spinner-size, 20px);
  height: var(--fav-spinner-size, 20px);
  border: 2px solid var(--fav-spinner-track, #e5e5e5);
  border-top-color: var(--fav-spinner-accent, #111111);
  border-radius: 50%;
  animation: favorites-spin var(--fav-spinner-speed, 0.8s) linear infinite;
}

@keyframes favorites-spin {
  to {
    transform: rotate(360deg);
  }
}
```

---

## Accessibility

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .favorites-btn,
  .favorites-btn__icon {
    transition: none;
  }

  .favorites-btn:active {
    transform: none;
  }

  .favorites-btn--animating .favorites-btn__icon {
    animation: none;
  }

  .favorites-btn--loading::after {
    animation: none;
    border-right-color: var(--fav-spinner-accent, #111111);
  }
}
```

### High Contrast
```css
@media (prefers-contrast: high) {
  .favorites-btn {
    border-width: 2px;
  }

  .favorites-btn:focus {
    outline-width: 3px;
  }

  .favorites-btn--full {
    border-width: 2px;
  }
}
```

### Minimum Touch Target
```css
.favorites-btn {
  min-width: 44px;
  min-height: 44px;
}
```

---

## Spacing Diagram

### Icon-Only Button
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌───────────────────────────────────────┐                  │
│  │            48px width                 │                  │
│  │  ◄────────────────────────────────►   │                  │
│  │                                       │                  │
│  │          ┌───────────────┐            │                  │
│  │          │               │            │  48px height     │
│  │          │   ♡           │            │  ▲               │
│  │          │   24x24px     │            │  │               │
│  │          │               │            │  │               │
│  │          └───────────────┘            │  ▼               │
│  │                                       │                  │
│  │  border: 1px solid                    │                  │
│  │  border-radius: 50% (circle)          │                  │
│  │                                       │                  │
│  └───────────────────────────────────────┘                  │
│                                                             │
│  Icon centered both horizontally and vertically             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Full-Width Button
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │   ◄── 24px ──►  ┌────┐ ◄─ 8px ─► Favorite   ◄── 24px ──►          │   │
│  │      padding    │ ♡  │    gap      text        padding             │   │
│  │                 │24px│   16px font                                 │   │
│  │                 └────┘   weight: 500                               │   │
│  │                                                                     │   │
│  │                            ▲                                        │   │
│  │                        60px│ height                                 │   │
│  │                            ▼                                        │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  border: 1.5px solid                                                        │
│  border-radius: 30px (pill)                                                 │
│  Content centered                                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### PDP Layout (with Add to Bag)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌───────────────────────────────────────────────────┐ ◄─12px─► ┌────────┐ │
│  │                                                   │          │        │ │
│  │                 Add to Bag                        │          │   ♡    │ │
│  │                                                   │          │        │ │
│  └───────────────────────────────────────────────────┘          └────────┘ │
│                     flex: 1                                     48x48px    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```
