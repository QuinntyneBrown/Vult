# Search Bar CSS Specification

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--search-bg` | `#F5F5F5` | Default background |
| `--search-bg-focus` | `#E5E5E5` | Focused background |
| `--search-text` | `#111111` | Input text |
| `--search-placeholder` | `#757575` | Placeholder text |
| `--search-icon` | `#111111` | Search icon |
| `--search-clear` | `#757575` | Clear button |
| `--search-clear-hover` | `#111111` | Clear button hover |
| `--dropdown-bg` | `#FFFFFF` | Dropdown background |
| `--dropdown-shadow` | `rgba(0,0,0,0.15)` | Dropdown shadow |
| `--suggestion-hover` | `#F5F5F5` | Suggestion item hover |

### Typography

| Element | Font Family | Size | Weight | Color |
|---------|-------------|------|--------|-------|
| Input | Helvetica Neue | 16px | 400 | #111111 |
| Placeholder | Helvetica Neue | 16px | 400 | #757575 |
| Section Title | Helvetica Neue | 12px | 500 | #757575 |
| Suggestion | Helvetica Neue | 16px | 400 | #111111 |
| Product Name | Helvetica Neue | 14px | 500 | #111111 |
| Product Category | Helvetica Neue | 12px | 400 | #757575 |
| Product Price | Helvetica Neue | 14px | 500 | #111111 |

### Dimensions

| Token | Value |
|-------|-------|
| `--search-height` | 40px |
| `--search-width-compact` | 180px |
| `--search-width-expanded` | 280px |
| `--search-border-radius` | 20px |
| `--search-icon-size` | 24px |
| `--dropdown-max-height` | 400px |
| `--dropdown-width` | 400px |
| `--product-thumb-size` | 56px |

### Spacing

| Token | Value |
|-------|-------|
| `--search-padding-left` | 44px |
| `--search-padding-right` | 40px |
| `--search-icon-left` | 12px |
| `--icon-text-gap` | 8px |
| `--dropdown-padding` | 16px |
| `--suggestion-padding` | 8px |

## Base Component

```css
.search-container {
    position: relative;
}

.search-input {
    height: 40px;
    border: none;
    border-radius: 20px;
    background-color: #F5F5F5;
    padding: 0 40px 0 44px;
    font-size: 16px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    transition: width 0.2s ease, background-color 0.2s ease;
    outline: none;
}

.search-input::placeholder {
    color: #757575;
}

.search-input:focus {
    background-color: #E5E5E5;
}
```

## Width Variants

```css
.search-input.compact {
    width: 180px;
}

.search-input.expanded {
    width: 280px;
    background-color: #E5E5E5;
}

.search-input.full-width {
    width: 100%;
}
```

## Search Icon

```css
.search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    fill: #111111;
    pointer-events: none;
}
```

## Clear Button

```css
.clear-btn {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    display: none;
}

.clear-btn.visible {
    display: block;
}

.clear-btn svg {
    width: 24px;
    height: 24px;
    fill: #757575;
    transition: fill 0.15s ease;
}

.clear-btn:hover svg {
    fill: #111111;
}

.clear-btn:focus {
    outline: 2px solid #111111;
    outline-offset: 2px;
    border-radius: 2px;
}
```

## Dropdown

```css
.search-dropdown {
    position: absolute;
    top: 48px;
    left: 0;
    width: 400px;
    background-color: #FFFFFF;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
    max-height: 400px;
    overflow-y: auto;
}

.dropdown-section {
    padding: 16px;
}

.dropdown-section:not(:last-child) {
    border-bottom: 1px solid #E5E5E5;
}

.dropdown-title {
    font-size: 12px;
    font-weight: 500;
    color: #757575;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.dropdown-title a {
    font-size: 12px;
    color: #757575;
    text-decoration: underline;
}
```

## Suggestion Items

```css
.suggestion-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;
    cursor: pointer;
    transition: background-color 0.15s ease;
    border-radius: 4px;
    margin: 0 -8px;
}

.suggestion-item:hover {
    background-color: #F5F5F5;
}

.suggestion-item:focus {
    outline: 2px solid #111111;
    outline-offset: -2px;
}

.suggestion-item svg {
    width: 20px;
    height: 20px;
    fill: #757575;
    flex-shrink: 0;
}

.suggestion-text {
    font-size: 16px;
    color: #111111;
    flex-grow: 1;
}

.suggestion-remove {
    width: 20px;
    height: 20px;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    opacity: 0;
    transition: opacity 0.15s ease;
}

.suggestion-item:hover .suggestion-remove {
    opacity: 1;
}

.suggestion-remove svg {
    fill: #757575;
}
```

## Product Suggestions

```css
.product-suggestion {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;
    cursor: pointer;
    transition: background-color 0.15s ease;
    border-radius: 4px;
    margin: 0 -8px;
}

.product-suggestion:hover {
    background-color: #F5F5F5;
}

.product-thumb {
    width: 56px;
    height: 56px;
    background-color: #F5F5F5;
    border-radius: 4px;
    flex-shrink: 0;
    overflow: hidden;
}

.product-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.product-info {
    flex-grow: 1;
}

.product-name {
    font-size: 14px;
    font-weight: 500;
    color: #111111;
}

.product-category {
    font-size: 12px;
    color: #757575;
}

.product-price {
    font-size: 14px;
    font-weight: 500;
    color: #111111;
}
```

## Spacing Diagram

```
Search Input:

┌────────────────────────────────────────────────────────────┐
│ ├─12px─┤                                      ├─8px─┤     │
│                                                            │
│   ┌────┐                                       ┌────┐     │
│   │ 🔍 │  ├─8px─┤  Input Text            │ ✕  │     │
│   │24px│                                       │24px│     │
│   └────┘                                       └────┘     │
│                                                            │
│ ▲                    height: 40px                      ▲   │
│ └──────────────────────────────────────────────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
  padding-left: 44px (12px + 24px icon + 8px gap)
  padding-right: 40px (8px + 24px clear + 8px)


Dropdown:

┌────────────────────────────────────────────────────────────┐
│ ├─16px─┤                                      ├─16px─┤     │
│ ▲                                                      ▲   │
│ 16px  SECTION TITLE                               16px    │
│ ▼                                                      ▼   │
│ ├─12px margin-bottom─┤                                     │
│                                                            │
│ ┌────────────────────────────────────────────────────┐     │
│ │ 🔍 ├─12px─┤ Suggestion text                        │     │
│ │ 20px                                               │     │
│ └────────────────────────────────────────────────────┘     │
│ ▲ 8px padding vertical                                     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Animation Specifications

| Property | Duration | Easing | Usage |
|----------|----------|--------|-------|
| width | 200ms | ease | Expand/collapse |
| background-color | 200ms | ease | Focus state |
| opacity | 150ms | ease | Clear button visibility |
| fill | 150ms | ease | Icon hover |

## Accessibility

```css
/* Focus visible for keyboard navigation */
.search-input:focus-visible {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

.search-input:focus:not(:focus-visible) {
    outline: none;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .search-input,
    .clear-btn svg,
    .suggestion-item,
    .suggestion-remove {
        transition: none;
    }
}
```

## ARIA Requirements

```html
<div class="search-container" role="search">
    <label for="search-input" class="sr-only">Search</label>
    <input
        type="text"
        id="search-input"
        class="search-input"
        placeholder="Search"
        aria-autocomplete="list"
        aria-controls="search-dropdown"
        aria-expanded="false"
    >
    <button class="clear-btn" aria-label="Clear search">
        <svg>...</svg>
    </button>

    <div id="search-dropdown" class="search-dropdown" role="listbox">
        <div role="option" class="suggestion-item">...</div>
    </div>
</div>
```

## Z-Index Stack

| Element | Z-Index |
|---------|---------|
| Search Input | 1 |
| Search Icon | 2 |
| Clear Button | 2 |
| Dropdown | 100 |
