# Page Header CSS Specification

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--header-bg` | `#FFFFFF` | Background color |
| `--header-title-color` | `#111111` | Title text color |
| `--header-subtitle-color` | `#757575` | Subtitle text color |
| `--header-count-color` | `#757575` | Product count color |

### Typography

| Element | Font Family | Size (Desktop) | Size (Mobile) | Weight | Line Height | Color |
|---------|-------------|----------------|---------------|--------|-------------|-------|
| Title | Helvetica Neue | 28px | 24px | 500 | 1.2 | #111111 |
| Subtitle | Helvetica Neue | 16px | 14px | 400 | 1.5 | #757575 |
| Count | Helvetica Neue | 28px | 24px | 400 | 1.2 | #757575 |

### Spacing

| Token | Desktop | Mobile |
|-------|---------|--------|
| `--header-padding-top` | 24px | 16px |
| `--header-padding-bottom` | 16px | 12px |
| `--header-padding-horizontal` | 48px | 16px |
| `--header-title-subtitle-gap` | 8px | 4px |

## Component Structure

### Container

```css
.page-header {
    width: 100%;
    background-color: #FFFFFF;
    padding: 24px 48px 16px;
}

@media (max-width: 768px) {
    .page-header {
        padding: 16px 16px 12px;
    }
}
```

### Title

```css
.page-header__title {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 28px;
    font-weight: 500;
    line-height: 1.2;
    color: #111111;
    margin: 0;
}

@media (max-width: 768px) {
    .page-header__title {
        font-size: 24px;
    }
}
```

### Product Count

```css
.page-header__count {
    font-weight: 400;
    color: #757575;
}

/* Inline with title */
.page-header__title .page-header__count {
    margin-left: 8px;
}
```

### Subtitle

```css
.page-header__subtitle {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
    color: #757575;
    margin: 8px 0 0;
    max-width: 600px;
}

@media (max-width: 768px) {
    .page-header__subtitle {
        font-size: 14px;
        margin-top: 4px;
    }
}
```

## Alignment Variants

```css
/* Left aligned (default) */
.page-header {
    text-align: left;
}

/* Center aligned */
.page-header--center {
    text-align: center;
}

.page-header--center .page-header__subtitle {
    margin-left: auto;
    margin-right: auto;
}
```

## Complete CSS

```css
/* Page Header Component */
.page-header {
    width: 100%;
    background-color: #FFFFFF;
    padding: 24px 48px 16px;
    text-align: left;
}

.page-header--center {
    text-align: center;
}

.page-header__title {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 28px;
    font-weight: 500;
    line-height: 1.2;
    color: #111111;
    margin: 0;
}

.page-header__count {
    font-weight: 400;
    color: #757575;
    margin-left: 8px;
}

.page-header__subtitle {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
    color: #757575;
    margin: 8px 0 0;
    max-width: 600px;
}

.page-header--center .page-header__subtitle {
    margin-left: auto;
    margin-right: auto;
}

/* Responsive */
@media (max-width: 768px) {
    .page-header {
        padding: 16px 16px 12px;
    }

    .page-header__title {
        font-size: 24px;
    }

    .page-header__subtitle {
        font-size: 14px;
        margin-top: 4px;
    }
}
```

## Spacing Diagram

```
Page Header Layout:

┌────────────────────────────────────────────────────────────────────────────┐
│ ▲                                                                          │
│ 24px padding-top                                                           │
│ ▼                                                                          │
├─48px─┤                                                          ├─48px─┤   │
│                                                                            │
│       Title Text (h1)                                                      │
│       ▲                                                                    │
│       │ 28px font-size, 500 weight, #111111                                │
│       │ line-height: 1.2                                                   │
│       ▼                                                                    │
│       ├─8px─┤                                                              │
│       ▼                                                                    │
│       Subtitle text (optional)                                             │
│       ▲                                                                    │
│       │ 16px font-size, 400 weight, #757575                                │
│       │ line-height: 1.5                                                   │
│       │ max-width: 600px                                                   │
│                                                                            │
│ ▲                                                                          │
│ 16px padding-bottom                                                        │
│ ▼                                                                          │
└────────────────────────────────────────────────────────────────────────────┘
```

## Accessibility

```css
/* Focus visible for interactive elements within header */
.page-header a:focus-visible {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .page-header * {
        transition: none;
    }
}
```
