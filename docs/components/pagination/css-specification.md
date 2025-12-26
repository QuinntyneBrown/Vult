# Pagination CSS Specification

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--pagination-text` | `#111111` | Page numbers |
| `--pagination-text-disabled` | `#CCCCCC` | Disabled arrows |
| `--pagination-hover-bg` | `#F5F5F5` | Hover background |
| `--pagination-focus` | `#111111` | Focus outline |
| `--pagination-progress` | `#757575` | Progress text |

### Dimensions

| Token | Value |
|-------|-------|
| `--pagination-button-size` | 40px |
| `--pagination-gap` | 4px |
| `--pagination-icon-size` | 20px |
| `--load-more-width` | 200px |
| `--load-more-height` | 48px |

## Component Structure

### Pagination Container

```css
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    padding: 24px 0;
}
```

### Page Button

```css
.pagination__button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: transparent;
    border: none;
    font-family: inherit;
    font-size: 14px;
    color: #111111;
    cursor: pointer;
    transition: background-color 0.15s ease;
}

.pagination__button:hover {
    background-color: #F5F5F5;
}

.pagination__button:focus {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

.pagination__button--current {
    font-weight: 500;
    text-decoration: underline;
}

.pagination__button--disabled {
    color: #CCCCCC;
    cursor: not-allowed;
}

.pagination__button--disabled:hover {
    background-color: transparent;
}
```

### Ellipsis

```css
.pagination__ellipsis {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    font-size: 14px;
    color: #111111;
}
```

### Load More

```css
.load-more {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 24px 0;
}

.load-more__progress {
    font-size: 14px;
    color: #757575;
}

.load-more__button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 48px;
    background-color: #FFFFFF;
    border: 1.5px solid #111111;
    border-radius: 24px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 500;
    color: #111111;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
}

.load-more__button:hover {
    background-color: #111111;
    color: #FFFFFF;
}
```

## Complete CSS

```css
/* Pagination */
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    padding: 24px 0;
}

.pagination__button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: transparent;
    border: none;
    border-radius: 0;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 14px;
    color: #111111;
    cursor: pointer;
    transition: background-color 0.15s ease;
}

.pagination__button:hover:not(.pagination__button--disabled) {
    background-color: #F5F5F5;
}

.pagination__button:focus {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

.pagination__button--current {
    font-weight: 500;
    text-decoration: underline;
}

.pagination__button--disabled {
    color: #CCCCCC;
    cursor: not-allowed;
}

.pagination__button svg {
    width: 20px;
    height: 20px;
}

.pagination__ellipsis {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    font-size: 14px;
    color: #111111;
}

/* Load More */
.load-more {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 24px 0;
}

.load-more__progress {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 14px;
    color: #757575;
}

.load-more__button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 48px;
    background-color: #FFFFFF;
    border: 1.5px solid #111111;
    border-radius: 24px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #111111;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
}

.load-more__button:hover {
    background-color: #111111;
    color: #FFFFFF;
}

.load-more__button:focus {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

/* Mobile */
@media (max-width: 768px) {
    .pagination--mobile {
        gap: 8px;
    }

    .pagination__page-info {
        font-size: 14px;
        color: #111111;
    }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .pagination__button,
    .load-more__button {
        transition: none;
    }
}
```

## Accessibility

```html
<nav aria-label="Pagination" class="pagination">
    <button class="pagination__button pagination__button--disabled" aria-label="Previous page" disabled>
        <svg><!-- arrow --></svg>
    </button>
    <button class="pagination__button" aria-label="Page 1">1</button>
    <button class="pagination__button pagination__button--current" aria-label="Page 2, current page" aria-current="page">2</button>
    <button class="pagination__button" aria-label="Page 3">3</button>
    <button class="pagination__button" aria-label="Next page">
        <svg><!-- arrow --></svg>
    </button>
</nav>
```
