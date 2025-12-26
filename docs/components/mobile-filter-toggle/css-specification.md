# Mobile Filter Toggle CSS Specification

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--toggle-bg` | `#FFFFFF` | Button background |
| `--toggle-border` | `#E5E5E5` | Button border |
| `--toggle-text` | `#111111` | Button text |
| `--toggle-icon` | `#111111` | Icon color |
| `--toggle-divider` | `#E5E5E5` | Divider between buttons |
| `--toggle-shadow` | `rgba(0,0,0,0.1)` | Container shadow |
| `--toggle-active-bg` | `#111111` | Active button background |
| `--toggle-active-text` | `#FFFFFF` | Active button text |

### Dimensions

| Token | Value |
|-------|-------|
| `--toggle-height` | 48px |
| `--toggle-icon-size` | 20px |
| `--toggle-padding` | 16px |
| `--toggle-container-padding` | 16px |

## Component Structure

### Fixed Container

```css
.mobile-filter-bar {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
    background-color: #FFFFFF;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    z-index: 100;
}

@media (max-width: 768px) {
    .mobile-filter-bar {
        display: block;
    }
}

/* Safe area for notched devices */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
    .mobile-filter-bar {
        padding-bottom: calc(16px + env(safe-area-inset-bottom));
    }
}
```

### Toggle Buttons

```css
.mobile-filter-buttons {
    display: flex;
    border: 1px solid #E5E5E5;
}

.mobile-filter-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 48px;
    padding: 0 16px;
    background-color: #FFFFFF;
    border: none;
    font-family: inherit;
    font-size: 14px;
    font-weight: 500;
    color: #111111;
    cursor: pointer;
    transition: background-color 0.15s ease;
}

.mobile-filter-button:first-child {
    border-right: 1px solid #E5E5E5;
}

.mobile-filter-button:hover {
    background-color: #F5F5F5;
}

.mobile-filter-button:focus {
    outline: 2px solid #111111;
    outline-offset: -2px;
}

.mobile-filter-button svg {
    width: 20px;
    height: 20px;
}
```

### Active State

```css
.mobile-filter-button--active {
    background-color: #111111;
    color: #FFFFFF;
}

.mobile-filter-button--active:hover {
    background-color: #333333;
}

.mobile-filter-button--active svg {
    stroke: #FFFFFF;
}
```

### Filter Count Badge

```css
.mobile-filter-button__count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    background-color: #111111;
    color: #FFFFFF;
    font-size: 12px;
    font-weight: 500;
    border-radius: 10px;
}

.mobile-filter-button--active .mobile-filter-button__count {
    background-color: #FFFFFF;
    color: #111111;
}
```

## Complete CSS

```css
/* Mobile Filter Bar */
.mobile-filter-bar {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
    background-color: #FFFFFF;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    z-index: 100;
}

@media (max-width: 768px) {
    .mobile-filter-bar {
        display: block;
    }
}

@supports (padding-bottom: env(safe-area-inset-bottom)) {
    .mobile-filter-bar {
        padding-bottom: calc(16px + env(safe-area-inset-bottom));
    }
}

/* Button Container */
.mobile-filter-buttons {
    display: flex;
    border: 1px solid #E5E5E5;
}

/* Filter/Sort Buttons */
.mobile-filter-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 48px;
    padding: 0 16px;
    background-color: #FFFFFF;
    border: none;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #111111;
    cursor: pointer;
    transition: background-color 0.15s ease;
}

.mobile-filter-button:first-child {
    border-right: 1px solid #E5E5E5;
}

.mobile-filter-button:hover {
    background-color: #F5F5F5;
}

.mobile-filter-button:focus {
    outline: 2px solid #111111;
    outline-offset: -2px;
}

.mobile-filter-button svg {
    width: 20px;
    height: 20px;
    stroke: currentColor;
    fill: none;
}

/* Active State */
.mobile-filter-button--active {
    background-color: #111111;
    color: #FFFFFF;
}

.mobile-filter-button--active:hover {
    background-color: #333333;
}

/* Count Badge */
.mobile-filter-button__count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    background-color: #111111;
    color: #FFFFFF;
    font-size: 12px;
    font-weight: 500;
    border-radius: 10px;
}

.mobile-filter-button--active .mobile-filter-button__count {
    background-color: #FFFFFF;
    color: #111111;
}

/* Single Button Variant */
.mobile-filter-button--single {
    border-right: none;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .mobile-filter-button {
        transition: none;
    }
}
```

## Spacing Diagram

```
Mobile Filter Toggle Layout:

┌────────────────────────────────────────────────┐
│ ├─────────────16px padding─────────────┤       │
│                                                │
│ ┌────────────────────────────────────────────┐ │
│ │ ├─16px─┤                        ├─16px─┤   │ │
│ │                                            │ │
│ │ ┌──────────────┐│┌──────────────┐          │ │
│ │ │              ││              │          │ │
│ │ │ ⊞ ├8px┤ Filter ││ ↕ ├8px┤ Sort │          │ │
│ │ │              ││              │          │ │
│ │ │    48px      ││    48px      │          │ │
│ │ └──────────────┘│└──────────────┘          │ │
│ │      flex: 1    │1px     flex: 1           │ │
│ │               divider                      │ │
│ │                                            │ │
│ └────────────────────────────────────────────┘ │
│                                                │
│ ├─────────────16px padding─────────────┤       │
│ (+ safe-area-inset-bottom if applicable)       │
└────────────────────────────────────────────────┘

Icon: 20x20px
Gap: 8px
Font: 14px, 500 weight
Button height: 48px
```

## Accessibility

```html
<div class="mobile-filter-bar" role="toolbar" aria-label="Filter and sort options">
    <div class="mobile-filter-buttons">
        <button class="mobile-filter-button" aria-expanded="false" aria-controls="filter-panel">
            <svg aria-hidden="true"><!-- filter icon --></svg>
            <span>Filter</span>
            <span class="mobile-filter-button__count" aria-label="3 filters applied">3</span>
        </button>
        <button class="mobile-filter-button" aria-expanded="false" aria-controls="sort-panel">
            <svg aria-hidden="true"><!-- sort icon --></svg>
            <span>Sort</span>
        </button>
    </div>
</div>
```

- Use `role="toolbar"` for the container
- `aria-expanded` indicates panel state
- `aria-controls` links to the panel it opens
- Count has `aria-label` for screen readers
