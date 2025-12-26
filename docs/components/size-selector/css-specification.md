# Size Selector CSS Specification

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--size-border` | `#E5E5E5` | Unselected border |
| `--size-border-hover` | `#111111` | Hover border |
| `--size-border-selected` | `#111111` | Selected border |
| `--size-text` | `#111111` | Button text |
| `--size-text-unavailable` | `#CCCCCC` | Unavailable text |
| `--size-bg` | `#FFFFFF` | Button background |

### Dimensions

| Token | Value |
|-------|-------|
| `--size-button-height` | 48px |
| `--size-gap` | 8px |
| `--size-columns` | 3 |
| `--size-border-width` | 1px |
| `--size-border-width-selected` | 1.5px |

## Component Structure

```css
.size-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
}

.size-button {
    height: 48px;
    padding: 8px;
    background-color: #FFFFFF;
    border: 1px solid #E5E5E5;
    font-family: inherit;
    font-size: 14px;
    color: #111111;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.15s ease;
}

.size-button:hover {
    border-color: #111111;
}

.size-button:focus {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

.size-button--selected {
    border: 1.5px solid #111111;
}

.size-button--unavailable {
    color: #CCCCCC;
}
```

## Complete CSS

```css
/* Size Grid */
.size-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
}

/* Size Button */
.size-button {
    height: 48px;
    padding: 8px;
    background-color: #FFFFFF;
    border: 1px solid #E5E5E5;
    border-radius: 0;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 14px;
    color: #111111;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.15s ease;
}

.size-button:hover {
    border-color: #111111;
}

.size-button:focus {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

.size-button:focus:not(:focus-visible) {
    outline: none;
}

.size-button:focus-visible {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

/* Selected */
.size-button--selected {
    border: 1.5px solid #111111;
}

/* Unavailable */
.size-button--unavailable {
    color: #CCCCCC;
}

.size-button--unavailable:hover {
    border-color: #E5E5E5;
}

/* Strikethrough variant for unavailable */
.size-button--unavailable.size-button--strikethrough {
    text-decoration: line-through;
}

/* Responsive - 2 columns on very narrow */
@media (max-width: 200px) {
    .size-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .size-button {
        transition: none;
    }
}
```

## Spacing Diagram

```
Size Grid Layout:

┌────────────────────────────────────────────────────┐
│                                                    │
│  display: grid                                     │
│  grid-template-columns: repeat(3, 1fr)             │
│  gap: 8px                                          │
│                                                    │
│  ┌────────────┐  ├─8px─┤  ┌────────────┐  ├─8px─┤ │
│  │            │           │            │          │
│  │   48px     │           │   48px     │          │
│  │   height   │           │   height   │          │
│  │            │           │            │          │
│  └────────────┘           └────────────┘          │
│  ├────1fr────┤             ├────1fr────┤          │
│                                                    │
│  ├───────────────8px row gap───────────────┤       │
│                                                    │
│  ┌────────────┐           ┌────────────┐          │
│  │   48px     │           │   48px     │          │
│  └────────────┘           └────────────┘          │
│                                                    │
└────────────────────────────────────────────────────┘

Individual Button:
┌────────────────────────────┐
│ ├──8px padding──┤          │
│                            │
│ height: 48px               │
│ font-size: 14px            │
│ text-align: center         │
│ border: 1px solid #E5E5E5  │
│                            │
└────────────────────────────┘
```

## Accessibility

```html
<div class="size-grid" role="group" aria-label="Filter by size">
    <button
        class="size-button"
        aria-pressed="false"
    >7</button>
    <button
        class="size-button size-button--selected"
        aria-pressed="true"
    >7.5</button>
    <button
        class="size-button size-button--unavailable"
        aria-disabled="true"
    >8</button>
</div>
```

- Use `role="group"` with `aria-label` for the grid
- Use `aria-pressed` to indicate selection state
- Use `aria-disabled` for unavailable sizes
