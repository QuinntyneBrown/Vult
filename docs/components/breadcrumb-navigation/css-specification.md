# Breadcrumb Navigation CSS Specification

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--breadcrumb-link` | `#757575` | Link text color |
| `--breadcrumb-link-hover` | `#111111` | Link hover color |
| `--breadcrumb-current` | `#111111` | Current page color |
| `--breadcrumb-separator` | `#757575` | Separator color |
| `--breadcrumb-focus` | `#111111` | Focus outline |

### Typography

| Element | Font Family | Size (Desktop) | Size (Mobile) | Weight | Line Height | Color |
|---------|-------------|----------------|---------------|--------|-------------|-------|
| Link | Helvetica Neue | 14px | 12px | 400 | 1.5 | #757575 |
| Current | Helvetica Neue | 14px | 12px | 400 | 1.5 | #111111 |
| Separator | Helvetica Neue | 14px | 12px | 400 | 1.5 | #757575 |

### Spacing

| Token | Desktop | Mobile |
|-------|---------|--------|
| `--breadcrumb-padding-horizontal` | 48px | 16px |
| `--breadcrumb-padding-vertical` | 12px | 12px |
| `--breadcrumb-separator-margin` | 8px | 6px |

## Component Structure

### Container

```css
.breadcrumb {
    padding: 12px 48px;
    background-color: #FFFFFF;
}

@media (max-width: 768px) {
    .breadcrumb {
        padding: 12px 16px;
    }
}
```

### Navigation List

```css
.breadcrumb__list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
}
```

### Breadcrumb Item

```css
.breadcrumb__item {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 1.5;
}

@media (max-width: 768px) {
    .breadcrumb__item {
        font-size: 12px;
    }
}
```

### Links

```css
.breadcrumb__link {
    color: #757575;
    text-decoration: none;
    transition: color 0.15s ease;
}

.breadcrumb__link:hover {
    color: #111111;
    text-decoration: underline;
}

.breadcrumb__link:focus {
    outline: 2px solid #111111;
    outline-offset: 2px;
}
```

### Current Page

```css
.breadcrumb__current {
    color: #111111;
    font-weight: 400;
}
```

### Separator

```css
.breadcrumb__separator {
    margin: 0 8px;
    color: #757575;
    user-select: none;
}

@media (max-width: 768px) {
    .breadcrumb__separator {
        margin: 0 6px;
    }
}
```

## Complete CSS

```css
/* Breadcrumb Navigation */
.breadcrumb {
    padding: 12px 48px;
    background-color: #FFFFFF;
}

.breadcrumb__nav {
    /* Semantic nav wrapper */
}

.breadcrumb__list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
}

.breadcrumb__item {
    display: flex;
    align-items: center;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 14px;
    line-height: 1.5;
}

.breadcrumb__link {
    color: #757575;
    text-decoration: none;
    transition: color 0.15s ease;
}

.breadcrumb__link:hover {
    color: #111111;
    text-decoration: underline;
}

.breadcrumb__link:focus {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

.breadcrumb__current {
    color: #111111;
    font-weight: 400;
}

.breadcrumb__separator {
    margin: 0 8px;
    color: #757575;
    user-select: none;
    pointer-events: none;
}

/* Mobile Truncation */
.breadcrumb__ellipsis {
    color: #757575;
    cursor: pointer;
    padding: 0 4px;
}

.breadcrumb__ellipsis:hover {
    color: #111111;
}

/* Hidden items on mobile */
.breadcrumb__item--hidden {
    display: none;
}

.breadcrumb--expanded .breadcrumb__item--hidden {
    display: flex;
}

.breadcrumb--expanded .breadcrumb__ellipsis {
    display: none;
}

/* Responsive */
@media (max-width: 768px) {
    .breadcrumb {
        padding: 12px 16px;
    }

    .breadcrumb__item {
        font-size: 12px;
    }

    .breadcrumb__separator {
        margin: 0 6px;
    }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .breadcrumb__link {
        transition: none;
    }
}
```

## Spacing Diagram

```
Breadcrumb Layout:

┌────────────────────────────────────────────────────────────────────────────┐
│ ├─────48px padding─────┤                               ├─────48px─────┤    │
│ ▲                                                                          │
│ 12px                                                                       │
│ ▼                                                                          │
│                                                                            │
│ Home ├─8px─┤ / ├─8px─┤ Men ├─8px─┤ / ├─8px─┤ Shoes ├─8px─┤ / ├─8px─┤ Current
│ ▲                                                                          │
│ │ font-size: 14px                                                          │
│ │ line-height: 1.5 (21px)                                                  │
│                                                                            │
│ ▲                                                                          │
│ 12px                                                                       │
│ ▼                                                                          │
└────────────────────────────────────────────────────────────────────────────┘

Total height: 12px + 21px + 12px = 45px
```

## Accessibility

```css
/* Screen reader only - for hidden link text */
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
.breadcrumb__link:focus-visible {
    outline: 2px solid #111111;
    outline-offset: 2px;
}
```

## Schema.org Markup

```html
<nav aria-label="Breadcrumb" class="breadcrumb">
    <ol class="breadcrumb__list" itemscope itemtype="https://schema.org/BreadcrumbList">
        <li class="breadcrumb__item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <a class="breadcrumb__link" itemprop="item" href="/">
                <span itemprop="name">Home</span>
            </a>
            <meta itemprop="position" content="1">
            <span class="breadcrumb__separator">/</span>
        </li>
        <!-- ... more items ... -->
        <li class="breadcrumb__item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <span class="breadcrumb__current" itemprop="name" aria-current="page">Current Page</span>
            <meta itemprop="position" content="4">
        </li>
    </ol>
</nav>
```
