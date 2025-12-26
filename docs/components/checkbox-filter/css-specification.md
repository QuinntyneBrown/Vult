# Checkbox Filter CSS Specification

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--checkbox-border` | `#111111` | Unchecked border |
| `--checkbox-bg-checked` | `#111111` | Checked background |
| `--checkbox-checkmark` | `#FFFFFF` | Checkmark color |
| `--checkbox-label` | `#111111` | Label text |
| `--checkbox-label-hover` | `#757575` | Label hover |
| `--checkbox-count` | `#757575` | Count text |
| `--checkbox-disabled` | `#CCCCCC` | Disabled state |

### Dimensions

| Token | Value |
|-------|-------|
| `--checkbox-size` | 18px |
| `--checkbox-border-width` | 1.5px |
| `--checkbox-border-radius` | 2px |
| `--checkbox-gap` | 12px |
| `--checkbox-row-padding` | 8px 0 |

## Component Structure

```css
.checkbox-filter {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    cursor: pointer;
}

.checkbox-filter:hover .checkbox-filter__label {
    color: #757575;
}

.checkbox-filter__input {
    width: 18px;
    height: 18px;
    border: 1.5px solid #111111;
    border-radius: 2px;
    appearance: none;
    cursor: pointer;
    position: relative;
    flex-shrink: 0;
}

.checkbox-filter__input:checked {
    background-color: #111111;
}

.checkbox-filter__input:checked::after {
    content: '';
    position: absolute;
    left: 5px;
    top: 2px;
    width: 5px;
    height: 9px;
    border: solid #FFFFFF;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

.checkbox-filter__input:focus {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

.checkbox-filter__input:disabled {
    border-color: #CCCCCC;
    cursor: not-allowed;
}

.checkbox-filter__label {
    font-size: 16px;
    color: #111111;
    flex: 1;
}

.checkbox-filter__count {
    font-size: 14px;
    color: #757575;
}
```

## Complete CSS

```css
/* Checkbox Filter */
.checkbox-filter {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    cursor: pointer;
}

.checkbox-filter:hover .checkbox-filter__label {
    color: #757575;
}

/* Hide native checkbox, style custom */
.checkbox-filter__input {
    width: 18px;
    height: 18px;
    border: 1.5px solid #111111;
    border-radius: 2px;
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    position: relative;
    flex-shrink: 0;
    background-color: transparent;
    transition: background-color 0.1s ease;
}

.checkbox-filter__input:checked {
    background-color: #111111;
}

/* Checkmark */
.checkbox-filter__input:checked::after {
    content: '';
    position: absolute;
    left: 5px;
    top: 2px;
    width: 5px;
    height: 9px;
    border: solid #FFFFFF;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

/* Focus */
.checkbox-filter__input:focus {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

.checkbox-filter__input:focus-visible {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

/* Disabled */
.checkbox-filter__input:disabled {
    border-color: #CCCCCC;
    cursor: not-allowed;
}

.checkbox-filter__input:disabled + .checkbox-filter__label {
    color: #CCCCCC;
    cursor: not-allowed;
}

/* Label */
.checkbox-filter__label {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 16px;
    color: #111111;
    flex: 1;
    line-height: 1.5;
}

/* Count */
.checkbox-filter__count {
    font-size: 14px;
    color: #757575;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .checkbox-filter__input {
        transition: none;
    }
}
```

## Spacing Diagram

```
Checkbox Filter Layout:

┌─────────────────────────────────────────────────┐
│ ├───0───┤                            ├───0───┤  │
│                                                 │
│ ▲                                               │
│ 8px padding-top                                 │
│ ▼                                               │
│                                                 │
│ ┌──────┐  ├─12px─┤  Label Text         (123)   │
│ │      │                                        │
│ │ 18px │            ├───flex: 1───┤    14px    │
│ │      │                             #757575    │
│ └──────┘                                        │
│                                                 │
│ ▲                                               │
│ 8px padding-bottom                              │
│ ▼                                               │
└─────────────────────────────────────────────────┘

Total row height: 8px + 24px (line) + 8px = 40px
```

## Accessibility

```html
<label class="checkbox-filter">
    <input type="checkbox" class="checkbox-filter__input" />
    <span class="checkbox-filter__label">Brand</span>
    <span class="checkbox-filter__count" aria-hidden="true">(124)</span>
</label>
```

- Native checkbox for accessibility
- Label wraps entire row for larger click target
- Focus ring visible for keyboard users
- Count hidden from screen readers (optional info)
