# Typography Display CSS Specification

## Design Tokens

### Font Family

```css
:root {
    --font-primary: "Helvetica Neue", Helvetica, Arial, sans-serif;
    --font-display: "Helvetica Neue", Helvetica, Arial, sans-serif;
}
```

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--text-primary` | `#111111` | Primary text color |
| `--text-secondary` | `#757575` | Secondary/muted text |
| `--text-inverse` | `#FFFFFF` | Text on dark backgrounds |
| `--text-sale` | `#9E3500` | Sale prices |
| `--text-error` | `#D32F2F` | Error messages |
| `--text-success` | `#388E3C` | Success messages |
| `--text-link` | `#111111` | Link color |
| `--text-link-hover` | `#757575` | Link hover color |

### Type Scale

| Token | Desktop | Tablet | Mobile |
|-------|---------|--------|--------|
| `--display-1` | 84px | 64px | 44px |
| `--display-2` | 64px | 48px | 36px |
| `--title-1` | 48px | 40px | 32px |
| `--title-2` | 36px | 32px | 28px |
| `--title-3` | 24px | 24px | 22px |
| `--title-4` | 20px | 20px | 18px |
| `--body-1` | 16px | 16px | 16px |
| `--body-2` | 14px | 14px | 14px |
| `--body-3` | 12px | 12px | 12px |
| `--overline` | 10px | 10px | 10px |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `--weight-regular` | 400 | Body text |
| `--weight-medium` | 500 | Body strong, buttons |
| `--weight-semibold` | 600 | Titles 2-3 |
| `--weight-bold` | 700 | Title 1 |
| `--weight-extrabold` | 800 | Display text |

### Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `--leading-none` | 1.0 | Display text |
| `--leading-tight` | 1.2 | Titles |
| `--leading-snug` | 1.3 | Title 3 |
| `--leading-normal` | 1.4 | Title 4 |
| `--leading-relaxed` | 1.5 | Body 2, captions |
| `--leading-loose` | 1.6 | Body 1 |

## Display Typography

```css
.display-1 {
    font-family: var(--font-display);
    font-size: 84px;
    font-weight: 800;
    line-height: 1.0;
    letter-spacing: -2px;
    color: #111111;
}

.display-2 {
    font-family: var(--font-display);
    font-size: 64px;
    font-weight: 800;
    line-height: 1.0;
    letter-spacing: -1px;
    color: #111111;
}

/* Responsive */
@media (max-width: 1024px) {
    .display-1 { font-size: 64px; }
    .display-2 { font-size: 48px; }
}

@media (max-width: 768px) {
    .display-1 { font-size: 44px; letter-spacing: -1px; }
    .display-2 { font-size: 36px; letter-spacing: -0.5px; }
}
```

## Title Hierarchy

```css
.title-1, h1 {
    font-family: var(--font-primary);
    font-size: 48px;
    font-weight: 700;
    line-height: 1.2;
    color: #111111;
}

.title-2, h2 {
    font-family: var(--font-primary);
    font-size: 36px;
    font-weight: 600;
    line-height: 1.2;
    color: #111111;
}

.title-3, h3 {
    font-family: var(--font-primary);
    font-size: 24px;
    font-weight: 600;
    line-height: 1.3;
    color: #111111;
}

.title-4, h4 {
    font-family: var(--font-primary);
    font-size: 20px;
    font-weight: 500;
    line-height: 1.4;
    color: #111111;
}

/* Responsive */
@media (max-width: 1024px) {
    .title-1, h1 { font-size: 40px; }
    .title-2, h2 { font-size: 32px; }
}

@media (max-width: 768px) {
    .title-1, h1 { font-size: 32px; }
    .title-2, h2 { font-size: 28px; }
    .title-3, h3 { font-size: 22px; }
    .title-4, h4 { font-size: 18px; }
}
```

## Body Text

```css
.body-1 {
    font-family: var(--font-primary);
    font-size: 16px;
    font-weight: 400;
    line-height: 1.6;
    color: #111111;
    max-width: 65ch;
}

.body-1-strong {
    font-family: var(--font-primary);
    font-size: 16px;
    font-weight: 500;
    line-height: 1.6;
    color: #111111;
}

.body-2 {
    font-family: var(--font-primary);
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    color: #111111;
}

.body-3, .caption {
    font-family: var(--font-primary);
    font-size: 12px;
    font-weight: 400;
    line-height: 1.5;
    color: #111111;
}

.caption {
    color: #757575;
}
```

## Utility Styles

```css
.overline {
    font-family: var(--font-primary);
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #111111;
}

.text-uppercase {
    text-transform: uppercase;
}

.text-center {
    text-align: center;
}

.text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.text-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
```

## Color Classes

```css
.text-primary { color: #111111; }
.text-secondary { color: #757575; }
.text-inverse { color: #FFFFFF; }
.text-sale { color: #9E3500; }
.text-error { color: #D32F2F; }
.text-success { color: #388E3C; }
```

## Link Styles

```css
a, .link {
    color: #111111;
    text-decoration: underline;
    text-underline-offset: 2px;
    font-weight: 500;
    transition: color 0.2s ease;
}

a:hover, .link:hover {
    color: #757575;
}

a:focus, .link:focus {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

/* No underline variant */
.link-plain {
    text-decoration: none;
}

.link-plain:hover {
    text-decoration: underline;
}
```

## Price Styles

```css
.price {
    font-family: var(--font-primary);
    font-size: 16px;
    font-weight: 500;
    color: #111111;
}

.price-sale {
    color: #9E3500;
}

.price-original {
    color: #757575;
    text-decoration: line-through;
    font-weight: 400;
    margin-left: 8px;
}
```

## Spacing/Rhythm

```css
/* Heading margins */
h1, .title-1 { margin-bottom: 24px; }
h2, .title-2 { margin-bottom: 20px; }
h3, .title-3 { margin-bottom: 16px; }
h4, .title-4 { margin-bottom: 12px; }

/* Paragraph spacing */
p + p { margin-top: 16px; }

/* Section spacing */
.text-section + .text-section { margin-top: 48px; }
```

## Complete Type Scale Reference

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ TYPOGRAPHY SCALE                                                                         │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│ Display 1:    84px / 800 / 1.0  / -2px tracking                                         │
│ Display 2:    64px / 800 / 1.0  / -1px tracking                                         │
│ Title 1:      48px / 700 / 1.2  / 0 tracking                                            │
│ Title 2:      36px / 600 / 1.2  / 0 tracking                                            │
│ Title 3:      24px / 600 / 1.3  / 0 tracking                                            │
│ Title 4:      20px / 500 / 1.4  / 0 tracking                                            │
│ Body 1:       16px / 400 / 1.6  / 0 tracking                                            │
│ Body 1 Str:   16px / 500 / 1.6  / 0 tracking                                            │
│ Body 2:       14px / 400 / 1.5  / 0 tracking                                            │
│ Body 3:       12px / 400 / 1.5  / 0 tracking                                            │
│ Overline:     10px / 500 / 1.5  / 1px tracking / uppercase                              │
│                                                                                          │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ COLORS                                                                                   │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│ Primary:      #111111          Secondary:    #757575                                    │
│ Inverse:      #FFFFFF          Sale:         #9E3500                                    │
│ Error:        #D32F2F          Success:      #388E3C                                    │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Accessibility

```css
/* Minimum font size for readability */
body {
    font-size: 16px; /* Minimum for body text */
}

/* Focus styles for links */
a:focus-visible {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    a, .link {
        transition: none;
    }
}

/* High contrast */
@media (prefers-contrast: high) {
    .text-secondary {
        color: #555555;
    }
}
```

## Line Length Guidelines

```css
/* Optimal reading length */
.prose {
    max-width: 65ch;
}

.prose-narrow {
    max-width: 45ch;
}

.prose-wide {
    max-width: 80ch;
}
```
