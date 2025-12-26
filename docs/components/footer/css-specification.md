# Footer CSS Specification

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--footer-bg` | `#111111` | Footer background |
| `--footer-text-primary` | `#FFFFFF` | Headings, hover state |
| `--footer-text-secondary` | `#7E7E7E` | Links, body text |
| `--footer-divider` | `#3D3D3D` | Divider lines |
| `--social-icon-bg` | `#7E7E7E` | Social icon background |
| `--social-icon-bg-hover` | `#FFFFFF` | Social icon hover |
| `--social-icon-color` | `#111111` | Social icon SVG |

### Typography

| Element | Font Family | Size | Weight | Line Height | Letter Spacing |
|---------|-------------|------|--------|-------------|----------------|
| Section Heading | Helvetica Neue | 10px | 500 | 1.5 | 1px |
| Link | Helvetica Neue | 12px | 400 | 1.5 | 0 |
| Copyright | Helvetica Neue | 12px | 400 | 1.5 | 0 |
| Legal Link | Helvetica Neue | 12px | 400 | 1.5 | 0 |

### Spacing

| Token | Value |
|-------|-------|
| `--footer-padding-desktop` | 48px |
| `--footer-padding-mobile` | 24px |
| `--column-gap` | 24px |
| `--heading-margin-bottom` | 24px |
| `--link-margin-bottom` | 12px |
| `--divider-margin` | 24px |
| `--social-icon-gap` | 16px |
| `--legal-links-gap` | 24px |

### Dimensions

| Token | Value |
|-------|-------|
| `--footer-max-width` | 1440px |
| `--social-icon-size` | 30px |
| `--social-icon-svg` | 16px |

## Base Component

```css
.footer {
    background-color: #111111;
    color: #7E7E7E;
    padding: 48px;
}

.footer-container {
    max-width: 1440px;
    margin: 0 auto;
}
```

## Footer Main Grid

```css
.footer-main {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-bottom: 40px;
}

@media (max-width: 1024px) {
    .footer-main {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 600px) {
    .footer-main {
        grid-template-columns: 1fr;
    }
}
```

## Footer Columns

```css
.footer-column h4 {
    color: #FFFFFF;
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 24px;
}

.footer-column ul {
    list-style: none;
}

.footer-column li {
    margin-bottom: 12px;
}

.footer-column a {
    color: #7E7E7E;
    text-decoration: none;
    font-size: 12px;
    transition: color 0.2s ease;
}

.footer-column a:hover {
    color: #FFFFFF;
}

.footer-column a:focus {
    outline: 2px solid #FFFFFF;
    outline-offset: 2px;
}
```

## Social Icons

```css
.social-icons {
    display: flex;
    gap: 16px;
    justify-content: flex-end;
}

.social-icon {
    width: 30px;
    height: 30px;
    background-color: #7E7E7E;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;
    text-decoration: none;
}

.social-icon:hover {
    background-color: #FFFFFF;
}

.social-icon:focus {
    outline: 2px solid #FFFFFF;
    outline-offset: 2px;
}

.social-icon svg {
    width: 16px;
    height: 16px;
    fill: #111111;
}

@media (max-width: 1024px) {
    .social-icons {
        justify-content: flex-start;
    }
}

@media (max-width: 600px) {
    .social-icons {
        justify-content: center;
        padding: 24px 0;
    }
}
```

## Divider

```css
.footer-divider {
    height: 1px;
    background-color: #3D3D3D;
    margin-bottom: 24px;
}
```

## Footer Bottom

```css
.footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 24px;
}

.footer-left {
    display: flex;
    align-items: center;
    gap: 24px;
}

.footer-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
}

@media (max-width: 600px) {
    .footer-bottom {
        flex-direction: column;
        align-items: flex-start;
    }

    .footer-right {
        align-items: flex-start;
    }
}
```

## Location Selector

```css
.location-selector {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #7E7E7E;
    font-size: 12px;
    cursor: pointer;
    transition: color 0.2s ease;
    background: none;
    border: none;
    padding: 0;
}

.location-selector:hover {
    color: #FFFFFF;
}

.location-selector:focus {
    outline: 2px solid #FFFFFF;
    outline-offset: 2px;
}

.location-selector svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
}
```

## Legal Links

```css
.copyright {
    color: #7E7E7E;
    font-size: 12px;
}

.legal-links {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
}

.legal-links a {
    color: #7E7E7E;
    text-decoration: none;
    font-size: 12px;
    transition: color 0.2s ease;
}

.legal-links a:hover {
    color: #FFFFFF;
}

.legal-links a:focus {
    outline: 2px solid #FFFFFF;
    outline-offset: 2px;
}

@media (max-width: 600px) {
    .legal-links {
        flex-direction: column;
        gap: 12px;
    }
}
```

## Mobile Accordion

```css
@media (max-width: 600px) {
    .footer {
        padding: 32px 24px;
    }

    .footer-column {
        border-bottom: 1px solid #3D3D3D;
        padding-bottom: 16px;
    }

    .footer-column h4 {
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0;
    }

    .footer-column h4::after {
        content: '+';
        font-size: 16px;
        font-weight: 400;
    }

    .footer-column.expanded h4::after {
        content: '−';
    }

    .footer-column ul {
        display: none;
        padding-top: 16px;
    }

    .footer-column.expanded ul {
        display: block;
    }
}
```

## Spacing Diagram

```
Footer Layout:

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ ▲                                                                                    ▲  │
│ 48px padding                                                               48px padding │
│ ▼                                                                                    ▼  │
│ ├─48px─┤                                                                    ├─48px─┤   │
│                                                                                          │
│  HEADING (10px, uppercase, #FFFFFF)                                                      │
│  ▲                                                                                       │
│  24px margin-bottom                                                                      │
│  ▼                                                                                       │
│  Link (12px, #7E7E7E)                                                                    │
│  ▲                                                                                       │
│  12px margin-bottom                                                                      │
│  ▼                                                                                       │
│  Link                                                                                    │
│  ▲                                                                                       │
│  12px margin-bottom                                                                      │
│  ▼                                                                                       │
│  Link                                                                                    │
│                                                                                          │
│ ▲                                                                                        │
│ 40px margin-bottom                                                                       │
│ ▼                                                                                        │
│ ─────────────────── divider (1px, #3D3D3D) ─────────────────                            │
│ ▲                                                                                        │
│ 24px margin-bottom                                                                       │
│ ▼                                                                                        │
│ Location              © Copyright   Term1  Term2  Term3  Term4                          │
│                                       └────── 24px gap ──────┘                          │
│ ▲                                                                                        │
│ 48px padding                                                                             │
│ ▼                                                                                        │
└─────────────────────────────────────────────────────────────────────────────────────────┘


Social Icon:

┌──────────┐
│          │
│   ┌──┐   │  30x30px circle
│   │🐦│   │  16x16px icon
│   └──┘   │  bg: #7E7E7E
│          │  bg-hover: #FFFFFF
└──────────┘
  ├─16px gap─┤
```

## Animation Specifications

| Property | Duration | Easing | Usage |
|----------|----------|--------|-------|
| color | 200ms | ease | Link hover |
| background-color | 200ms | ease | Social icon hover |

## Accessibility

```css
/* Focus visible */
.footer-column a:focus-visible,
.social-icon:focus-visible,
.location-selector:focus-visible,
.legal-links a:focus-visible {
    outline: 2px solid #FFFFFF;
    outline-offset: 2px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .footer-column a,
    .social-icon,
    .location-selector,
    .legal-links a {
        transition: none;
    }
}
```

## Z-Index Stack

| Element | Z-Index |
|---------|---------|
| Footer | 1 |
| Location dropdown | 10 |
