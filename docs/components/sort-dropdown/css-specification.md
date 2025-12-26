# Sort Dropdown CSS Specification

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--dropdown-bg` | `#FFFFFF` | Trigger and menu background |
| `--dropdown-border` | `#E5E5E5` | Default border |
| `--dropdown-border-active` | `#111111` | Active/hover border |
| `--dropdown-label` | `#757575` | "Sort By:" label |
| `--dropdown-value` | `#111111` | Selected value text |
| `--dropdown-option` | `#111111` | Option text |
| `--dropdown-option-hover` | `#F5F5F5` | Option hover background |
| `--dropdown-shadow` | `rgba(0,0,0,0.1)` | Menu shadow |
| `--dropdown-checkmark` | `#111111` | Selected checkmark |

### Typography

| Element | Font Family | Size | Weight | Color |
|---------|-------------|------|--------|-------|
| Label | Helvetica Neue | 14px | 400 | #757575 |
| Value | Helvetica Neue | 14px | 500 | #111111 |
| Option | Helvetica Neue | 14px | 400 | #111111 |

### Spacing

| Token | Value |
|-------|-------|
| `--dropdown-width` | 200px |
| `--dropdown-height` | 40px |
| `--dropdown-height-mobile` | 48px |
| `--dropdown-padding` | 0 16px |
| `--dropdown-option-height` | 40px |
| `--dropdown-option-padding` | 0 16px |

## Component Structure

### Trigger Button

```css
.sort-dropdown {
    position: relative;
    width: 200px;
}

.sort-dropdown__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 40px;
    padding: 0 16px;
    background-color: #FFFFFF;
    border: 1px solid #E5E5E5;
    border-radius: 0;
    cursor: pointer;
    font-family: inherit;
    transition: border-color 0.15s ease;
}

.sort-dropdown__trigger:hover {
    border-color: #111111;
}

.sort-dropdown__trigger:focus {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

.sort-dropdown--open .sort-dropdown__trigger {
    border-color: #111111;
}
```

### Trigger Content

```css
.sort-dropdown__label {
    font-size: 14px;
    color: #757575;
    margin-right: 4px;
}

.sort-dropdown__value {
    font-size: 14px;
    font-weight: 500;
    color: #111111;
}

.sort-dropdown__chevron {
    width: 12px;
    height: 12px;
    margin-left: 8px;
    transition: transform 0.2s ease;
}

.sort-dropdown--open .sort-dropdown__chevron {
    transform: rotate(180deg);
}
```

### Dropdown Menu

```css
.sort-dropdown__menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 4px;
    background-color: #FFFFFF;
    border: 1px solid #E5E5E5;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    z-index: 100;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-8px);
    transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s;
}

.sort-dropdown--open .sort-dropdown__menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}
```

### Menu Options

```css
.sort-dropdown__option {
    display: flex;
    align-items: center;
    width: 100%;
    height: 40px;
    padding: 0 16px;
    background: none;
    border: none;
    font-family: inherit;
    font-size: 14px;
    color: #111111;
    cursor: pointer;
    text-align: left;
    transition: background-color 0.1s ease;
}

.sort-dropdown__option:hover {
    background-color: #F5F5F5;
}

.sort-dropdown__option:focus {
    outline: none;
    background-color: #F5F5F5;
}

.sort-dropdown__option--selected {
    font-weight: 500;
}

.sort-dropdown__checkmark {
    width: 16px;
    height: 16px;
    margin-right: 12px;
    opacity: 0;
}

.sort-dropdown__option--selected .sort-dropdown__checkmark {
    opacity: 1;
}
```

## Complete CSS

```css
/* Sort Dropdown */
.sort-dropdown {
    position: relative;
    width: 200px;
}

.sort-dropdown__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 40px;
    padding: 0 16px;
    background-color: #FFFFFF;
    border: 1px solid #E5E5E5;
    border-radius: 0;
    cursor: pointer;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    transition: border-color 0.15s ease;
}

.sort-dropdown__trigger:hover {
    border-color: #111111;
}

.sort-dropdown__trigger:focus {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

.sort-dropdown--open .sort-dropdown__trigger {
    border-color: #111111;
}

.sort-dropdown__trigger-content {
    display: flex;
    align-items: center;
}

.sort-dropdown__label {
    font-size: 14px;
    color: #757575;
    margin-right: 4px;
}

.sort-dropdown__value {
    font-size: 14px;
    font-weight: 500;
    color: #111111;
}

.sort-dropdown__chevron {
    width: 12px;
    height: 12px;
    margin-left: 8px;
    transition: transform 0.2s ease;
}

.sort-dropdown--open .sort-dropdown__chevron {
    transform: rotate(180deg);
}

/* Menu */
.sort-dropdown__menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 4px;
    background-color: #FFFFFF;
    border: 1px solid #E5E5E5;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    z-index: 100;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-8px);
    transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s;
    list-style: none;
    margin: 4px 0 0;
    padding: 0;
}

.sort-dropdown--open .sort-dropdown__menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

/* Options */
.sort-dropdown__option {
    display: flex;
    align-items: center;
    width: 100%;
    height: 40px;
    padding: 0 16px;
    background: none;
    border: none;
    font-family: inherit;
    font-size: 14px;
    color: #111111;
    cursor: pointer;
    text-align: left;
    transition: background-color 0.1s ease;
}

.sort-dropdown__option:hover,
.sort-dropdown__option:focus {
    background-color: #F5F5F5;
    outline: none;
}

.sort-dropdown__option--selected {
    font-weight: 500;
}

.sort-dropdown__checkmark {
    width: 16px;
    height: 16px;
    margin-right: 12px;
    opacity: 0;
}

.sort-dropdown__option--selected .sort-dropdown__checkmark {
    opacity: 1;
}

/* Mobile */
@media (max-width: 768px) {
    .sort-dropdown {
        width: 100%;
    }

    .sort-dropdown__trigger {
        height: 48px;
    }

    .sort-dropdown__option {
        height: 48px;
        border-bottom: 1px solid #E5E5E5;
    }

    .sort-dropdown__option:last-child {
        border-bottom: none;
    }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .sort-dropdown__trigger,
    .sort-dropdown__menu,
    .sort-dropdown__chevron,
    .sort-dropdown__option {
        transition: none;
    }
}
```

## Spacing Diagram

```
Sort Dropdown Layout:

Trigger:
┌─────────────────────────────────┐
│ ├─────16px─────┤     ├───16px──┤│
│                                 │
│ Sort By: Featured          ▼   │
│ ├───────────┤├───────────┤ ├─┤ │
│    Label      Value     12px   │
│    #757575    #111111   chevron│
│                                 │
└─────────────────────────────────┘
   ├─────────200px────────────┤
   Height: 40px

Menu:
┌─────────────────────────────────┐
│ ├───16px───┤           ├──16px─┤
│                                 │
│ ✓ ├─12px─┤ Featured            │ ← 40px height
│ │                               │
│ 16x16                           │
│─────────────────────────────────│
│                                 │
│   ├─28px─┤ Newest              │
│   (checkmark placeholder)       │
│                                 │
└─────────────────────────────────┘

Shadow: 0 4px 16px rgba(0,0,0,0.1)
Border: 1px solid #E5E5E5
```

## Animation Specifications

| Property | Duration | Easing | Usage |
|----------|----------|--------|-------|
| Border color | 150ms | ease | Trigger hover |
| Chevron rotation | 200ms | ease | Open/close |
| Menu opacity | 150ms | ease | Open/close |
| Menu transform | 150ms | ease | Open/close |
| Option bg | 100ms | ease | Hover |

## Accessibility

```css
/* Screen reader only */
.sr-only {
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
.sort-dropdown__trigger:focus-visible {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

.sort-dropdown__option:focus-visible {
    background-color: #F5F5F5;
}
```
