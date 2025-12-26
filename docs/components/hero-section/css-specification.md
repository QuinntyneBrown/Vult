# Hero Section CSS Specification

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--hero-text-light` | `#FFFFFF` | Text on dark backgrounds |
| `--hero-text-dark` | `#111111` | Text on light backgrounds |
| `--hero-overlay-dark` | `rgba(0,0,0,0.6)` | Dark gradient overlay |
| `--hero-overlay-light` | `rgba(0,0,0,0)` | Transparent overlay |
| `--hero-btn-light-bg` | `#FFFFFF` | Light button background |
| `--hero-btn-light-hover` | `#E5E5E5` | Light button hover |
| `--hero-btn-dark-bg` | `#111111` | Dark button background |
| `--hero-btn-dark-hover` | `#333333` | Dark button hover |

### Typography

| Element | Font Family | Size | Weight | Line Height | Letter Spacing |
|---------|-------------|------|--------|-------------|----------------|
| Eyebrow | Helvetica Neue | 16px | 500 | 1.5 | 2px |
| Headline (Desktop) | Helvetica Neue | 84px | 800 | 1.0 | -2px |
| Headline (Tablet) | Helvetica Neue | 64px | 800 | 1.0 | -1px |
| Headline (Mobile) | Helvetica Neue | 44px | 800 | 1.1 | -1px |
| Subheadline (Desktop) | Helvetica Neue | 24px | 400 | 1.4 | 0 |
| Subheadline (Tablet) | Helvetica Neue | 20px | 400 | 1.4 | 0 |
| Subheadline (Mobile) | Helvetica Neue | 18px | 400 | 1.4 | 0 |
| Button | Helvetica Neue | 16px | 500 | 1 | 0 |

### Spacing Scale

| Token | Value |
|-------|-------|
| `--hero-padding-desktop` | 48px |
| `--hero-padding-tablet` | 24px |
| `--hero-padding-mobile` | 16px |
| `--hero-content-gap-sm` | 8px |
| `--hero-content-gap-md` | 16px |
| `--hero-content-gap-lg` | 24px |
| `--hero-content-gap-xl` | 32px |
| `--hero-btn-gap` | 12px |

## Component Dimensions

### Container

```css
.hero {
    position: relative;
    width: 100%;
    height: 700px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Tablet */
@media (max-width: 1024px) {
    .hero {
        height: 600px;
    }
}

/* Mobile */
@media (max-width: 768px) {
    .hero {
        height: auto;
        min-height: 500px;
        padding: 80px 0;
    }
}
```

### Background

```css
.hero-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.hero-background img,
.hero-background video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}
```

### Overlay

```css
.hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.6) 0%,
        rgba(0, 0, 0, 0.3) 40%,
        rgba(0, 0, 0, 0) 100%
    );
    z-index: 2;
}

/* Alternate: Radial vignette */
.hero-overlay--vignette {
    background: radial-gradient(
        ellipse at center,
        transparent 0%,
        rgba(0, 0, 0, 0.3) 100%
    );
}
```

### Content Container

```css
.hero-content {
    position: relative;
    z-index: 3;
    text-align: center;
    color: #FFFFFF;
    max-width: 800px;
    padding: 0 48px;
}

@media (max-width: 768px) {
    .hero-content {
        padding: 0 24px;
    }
}
```

### Typography

```css
.hero-eyebrow {
    font-size: 16px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 8px;
    opacity: 0.9;
}

.hero-headline {
    font-size: 84px;
    font-weight: 800;
    line-height: 1.0;
    letter-spacing: -2px;
    margin-bottom: 16px;
    text-transform: uppercase;
}

@media (max-width: 1024px) {
    .hero-headline {
        font-size: 64px;
    }
}

@media (max-width: 768px) {
    .hero-headline {
        font-size: 44px;
        letter-spacing: -1px;
    }
}

.hero-subheadline {
    font-size: 24px;
    font-weight: 400;
    line-height: 1.4;
    margin-bottom: 32px;
    opacity: 0.9;
}

@media (max-width: 1024px) {
    .hero-subheadline {
        font-size: 20px;
    }
}

@media (max-width: 768px) {
    .hero-subheadline {
        font-size: 18px;
        margin-bottom: 24px;
    }
}
```

### CTA Buttons

```css
.hero-cta-group {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
}

@media (max-width: 768px) {
    .hero-cta-group {
        flex-direction: column;
    }
}

.hero-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 16px 32px;
    font-size: 16px;
    font-weight: 500;
    text-decoration: none;
    border-radius: 30px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 140px;
}

@media (max-width: 768px) {
    .hero-btn {
        width: 100%;
    }
}

/* Primary Button - Light */
.hero-btn-primary {
    background-color: #FFFFFF;
    color: #111111;
}

.hero-btn-primary:hover {
    background-color: #E5E5E5;
}

.hero-btn-primary:focus {
    outline: 2px solid #FFFFFF;
    outline-offset: 2px;
}

/* Secondary Button - Outlined */
.hero-btn-secondary {
    background-color: transparent;
    color: #FFFFFF;
    border: 1.5px solid #FFFFFF;
}

.hero-btn-secondary:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.hero-btn-secondary:focus {
    outline: 2px solid #FFFFFF;
    outline-offset: 2px;
}
```

## Spacing Diagram

```
Desktop Hero (700px height):
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│ ├─48px─┤                      BACKGROUND                       ├─48px─┤    │
│                                                                              │
│                                                                              │
│                     ┌─────────────────────────────────┐                      │
│                     │        max-width: 800px         │                      │
│                     │                                 │                      │
│                     │  EYEBROW TEXT (16px)            │                      │
│                     │  ▲                              │                      │
│                     │  8px margin-bottom              │                      │
│                     │  ▼                              │                      │
│                     │  HEADLINE (84px)                │                      │
│                     │  ▲                              │                      │
│                     │  16px margin-bottom             │                      │
│                     │  ▼                              │                      │
│                     │  Subheadline text (24px)        │                      │
│                     │  ▲                              │                      │
│                     │  32px margin-bottom             │                      │
│                     │  ▼                              │                      │
│                     │  ┌───────┐ ├─12px─┤ ┌───────┐   │                      │
│                     │  │  CTA  │         │  CTA  │   │                      │
│                     │  └───────┘         └───────┘   │                      │
│                     │                                 │                      │
│                     └─────────────────────────────────┘                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

Button Detail:
┌────────────────────────────────────┐
│                                    │  Height: auto (padding-based)
│  ├─32px─┤  Button Text  ├─32px─┤  │  Min-width: 140px
│                                    │  Border-radius: 30px
│  ▲          ▲         ▲           │
│ 16px       16px      16px         │  Vertical padding: 16px
└────────────────────────────────────┘
```

## Layout Variants

### Left-Aligned

```css
.hero--left-aligned {
    align-items: flex-end;
    justify-content: flex-start;
}

.hero--left-aligned .hero-content {
    text-align: left;
    max-width: none;
    padding: 64px 48px;
}

.hero--left-aligned .hero-headline {
    max-width: 600px;
}

.hero--left-aligned .hero-subheadline {
    max-width: 500px;
}

.hero--left-aligned .hero-cta-group {
    justify-content: flex-start;
}
```

### Bottom-Aligned

```css
.hero--bottom-aligned {
    align-items: flex-end;
    padding-bottom: 64px;
}
```

### Light Theme

```css
.hero--light {
    background-color: #F5F5F5;
}

.hero--light .hero-content {
    color: #111111;
}

.hero--light .hero-btn-primary {
    background-color: #111111;
    color: #FFFFFF;
}

.hero--light .hero-btn-primary:hover {
    background-color: #333333;
}

.hero--light .hero-btn-secondary {
    color: #111111;
    border-color: #111111;
}

.hero--light .hero-btn-secondary:hover {
    background-color: rgba(0, 0, 0, 0.05);
}
```

## Animation Specifications

| Property | Duration | Easing | Usage |
|----------|----------|--------|-------|
| Button background | 200ms | ease | Hover state |
| Button border | 200ms | ease | Hover state |
| Content fade-in | 600ms | ease-out | Initial load |
| Content slide-up | 600ms | ease-out | Initial load (with fade) |

### Entrance Animation

```css
@keyframes heroFadeUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.hero-content {
    animation: heroFadeUp 600ms ease-out forwards;
}

.hero-eyebrow {
    animation-delay: 100ms;
}

.hero-headline {
    animation-delay: 200ms;
}

.hero-subheadline {
    animation-delay: 300ms;
}

.hero-cta-group {
    animation-delay: 400ms;
}
```

## Accessibility

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
    .hero-content,
    .hero-eyebrow,
    .hero-headline,
    .hero-subheadline,
    .hero-cta-group {
        animation: none;
    }

    .hero video {
        display: none;
    }

    .hero video + img {
        display: block;
    }
}
```

### Focus States

```css
.hero-btn:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
}
```

## Z-Index Stack

| Element | Z-Index |
|---------|---------|
| Background | 1 |
| Overlay | 2 |
| Content | 3 |
