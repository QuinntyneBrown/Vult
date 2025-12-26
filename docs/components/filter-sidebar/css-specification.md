# Filter Sidebar CSS Specification

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--sidebar-bg` | `#FFFFFF` | Sidebar background |
| `--sidebar-border` | `#E5E5E5` | Section dividers |
| `--sidebar-header-text` | `#111111` | "Filter" title |
| `--sidebar-section-text` | `#111111` | Section headers |
| `--sidebar-option-text` | `#111111` | Filter option text |
| `--sidebar-count-text` | `#757575` | Selection count |
| `--sidebar-clear-text` | `#757575` | Clear button text |
| `--sidebar-clear-hover` | `#111111` | Clear button hover |
| `--chevron-color` | `#111111` | Chevron icons |

### Typography

| Element | Font Family | Size | Weight | Line Height | Color |
|---------|-------------|------|--------|-------------|-------|
| Title | Helvetica Neue | 24px | 500 | 1.2 | #111111 |
| Section Header | Helvetica Neue | 16px | 400 | 1.5 | #111111 |
| Option Text | Helvetica Neue | 16px | 400 | 1.5 | #111111 |
| Count | Helvetica Neue | 14px | 400 | 1.5 | #757575 |
| Clear | Helvetica Neue | 14px | 400 | 1.5 | #757575 |
| Show More | Helvetica Neue | 14px | 500 | 1.5 | #111111 |

### Spacing

| Token | Value |
|-------|-------|
| `--sidebar-width` | 260px |
| `--sidebar-padding` | 16px |
| `--section-height` | 48px |
| `--option-gap` | 12px |
| `--title-margin-bottom` | 24px |

## Component Structure

### Sidebar Container

```css
.filter-sidebar {
    width: 260px;
    background-color: #FFFFFF;
    position: sticky;
    top: 0;
    max-height: 100vh;
    overflow-y: auto;
    flex-shrink: 0;
}

@media (max-width: 768px) {
    .filter-sidebar {
        display: none;
    }
}
```

### Sidebar Header

```css
.filter-sidebar__header {
    padding: 24px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #E5E5E5;
}

.filter-sidebar__title {
    font-size: 24px;
    font-weight: 500;
    color: #111111;
    margin: 0;
}

.filter-sidebar__clear-all {
    font-size: 14px;
    color: #757575;
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
}

.filter-sidebar__clear-all:hover {
    color: #111111;
}
```

### Filter Section

```css
.filter-section {
    border-bottom: 1px solid #E5E5E5;
}

.filter-section__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    cursor: pointer;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
}

.filter-section__header:hover {
    background-color: #F5F5F5;
}

.filter-section__title {
    font-size: 16px;
    font-weight: 400;
    color: #111111;
    display: flex;
    align-items: center;
    gap: 8px;
}

.filter-section__count {
    font-size: 14px;
    color: #757575;
}

.filter-section__chevron {
    width: 12px;
    height: 12px;
    transition: transform 0.2s ease;
}

.filter-section--expanded .filter-section__chevron {
    transform: rotate(180deg);
}
```

### Filter Section Content

```css
.filter-section__content {
    padding: 0 16px 16px;
    display: none;
}

.filter-section--expanded .filter-section__content {
    display: block;
}

/* Animation variant */
.filter-section__content--animated {
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.3s ease, padding 0.3s ease;
}

.filter-section--expanded .filter-section__content--animated {
    max-height: 500px;
    padding-bottom: 16px;
}
```

### Checkbox Options

```css
.filter-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    cursor: pointer;
}

.filter-option:hover {
    color: #757575;
}

.filter-option__checkbox {
    width: 18px;
    height: 18px;
    border: 1.5px solid #111111;
    border-radius: 2px;
    appearance: none;
    cursor: pointer;
    position: relative;
}

.filter-option__checkbox:checked {
    background-color: #111111;
}

.filter-option__checkbox:checked::after {
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

.filter-option__label {
    font-size: 16px;
    color: #111111;
}
```

### Show More Link

```css
.filter-section__show-more {
    font-size: 14px;
    font-weight: 500;
    color: #111111;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px 0;
    text-decoration: underline;
}

.filter-section__show-more:hover {
    color: #757575;
}
```

## Complete CSS

```css
/* Filter Sidebar */
.filter-sidebar {
    width: 260px;
    background-color: #FFFFFF;
    position: sticky;
    top: 0;
    max-height: 100vh;
    overflow-y: auto;
    flex-shrink: 0;
}

.filter-sidebar__header {
    padding: 24px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #E5E5E5;
}

.filter-sidebar__title {
    font-size: 24px;
    font-weight: 500;
    color: #111111;
    margin: 0;
}

.filter-sidebar__clear-all {
    font-size: 14px;
    color: #757575;
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
}

.filter-sidebar__clear-all:hover {
    color: #111111;
}

/* Filter Sections */
.filter-section {
    border-bottom: 1px solid #E5E5E5;
}

.filter-section__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    cursor: pointer;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    font-family: inherit;
}

.filter-section__header:hover {
    background-color: #F5F5F5;
}

.filter-section__header:focus {
    outline: 2px solid #111111;
    outline-offset: -2px;
}

.filter-section__title {
    font-size: 16px;
    font-weight: 400;
    color: #111111;
    display: flex;
    align-items: center;
    gap: 8px;
}

.filter-section__count {
    font-size: 14px;
    color: #757575;
}

.filter-section__chevron {
    width: 12px;
    height: 12px;
    transition: transform 0.2s ease;
}

.filter-section--expanded .filter-section__chevron {
    transform: rotate(180deg);
}

/* Filter Content */
.filter-section__content {
    padding: 0 16px 16px;
    display: none;
}

.filter-section--expanded .filter-section__content {
    display: block;
}

/* Filter Options */
.filter-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    cursor: pointer;
}

.filter-option__checkbox {
    width: 18px;
    height: 18px;
    border: 1.5px solid #111111;
    border-radius: 2px;
    appearance: none;
    cursor: pointer;
    position: relative;
    flex-shrink: 0;
}

.filter-option__checkbox:checked {
    background-color: #111111;
}

.filter-option__checkbox:checked::after {
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

.filter-option__checkbox:focus {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

.filter-option__label {
    font-size: 16px;
    color: #111111;
}

/* Show More */
.filter-section__show-more {
    font-size: 14px;
    font-weight: 500;
    color: #111111;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px 0;
    text-decoration: underline;
}

.filter-section__show-more:hover {
    color: #757575;
}

/* Responsive */
@media (max-width: 768px) {
    .filter-sidebar {
        display: none;
    }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .filter-section__chevron,
    .filter-section__content {
        transition: none;
    }
}
```

## Spacing Diagram

```
Filter Sidebar Layout:

┌────────────────────────────┐
│ ├─────16px──────┤          │
│ ▲                          │
│ 24px                       │
│ ▼                          │
│ Filter        [Clear All]  │
│ ▲                          │
│ 24px                       │
│ ▼                          │
├────────────────────────────┤
│ ├─────16px──────┤          │
│ ▲                          │
│ 16px                       │
│ ▼                          │
│ Section Title          ▼   │ ← 48px total height
│ ▲                          │
│ 16px                       │
│ ▼                          │
├────────────────────────────┤
│                            │
│ ├──16px──┤                 │
│ ▲                          │
│ 8px                        │
│ ▼                          │
│ ├─18px─┤ ├─12px─┤ Label    │
│ ▲                          │
│ 8px                        │
│ ▼                          │
│ ├─18px─┤ ├─12px─┤ Label    │
│ ▲                          │
│ 16px                       │
│ ▼                          │
├────────────────────────────┤
```

## Accessibility

```css
/* Screen reader only text */
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
.filter-section__header:focus-visible {
    outline: 2px solid #111111;
    outline-offset: -2px;
}

.filter-option__checkbox:focus-visible {
    outline: 2px solid #111111;
    outline-offset: 2px;
}
```

## Animation Specifications

| Property | Duration | Easing | Usage |
|----------|----------|--------|-------|
| Chevron rotation | 200ms | ease | Section toggle |
| Content expand | 300ms | ease | Section content reveal |
| Background color | 150ms | ease | Hover states |
