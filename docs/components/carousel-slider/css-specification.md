# Carousel/Slider CSS Specification

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--carousel-bg` | `#FFFFFF` | Container background |
| `--arrow-bg` | `#E5E5E5` | Arrow button background |
| `--arrow-bg-hover` | `#CCCCCC` | Arrow button hover |
| `--arrow-bg-disabled` | `#F5F5F5` | Arrow button disabled |
| `--arrow-icon` | `#111111` | Arrow icon color |
| `--arrow-icon-disabled` | `#CCCCCC` | Arrow icon disabled |
| `--dot-inactive` | `#E5E5E5` | Pagination dot inactive |
| `--dot-active` | `#111111` | Pagination dot active |
| `--gradient-color` | `#FFFFFF` | Fade gradient base |
| `--shadow-arrow` | `rgba(0,0,0,0.15)` | Inline arrow shadow |

### Typography

| Element | Font Family | Size | Weight | Color |
|---------|-------------|------|--------|-------|
| Section Title | Helvetica Neue | 24px | 500 | #111111 |

### Spacing

| Token | Value |
|-------|-------|
| `--container-padding-desktop` | 48px |
| `--container-padding-tablet` | 24px |
| `--container-padding-mobile` | 16px |
| `--item-gap-desktop` | 16px |
| `--item-gap-mobile` | 12px |
| `--title-margin-bottom` | 24px |
| `--arrow-size` | 48px |
| `--arrow-gap` | 8px |
| `--dot-size` | 8px |
| `--dot-gap` | 8px |
| `--dots-margin-top` | 24px |

## Component Dimensions

### Container

```css
.carousel-section {
    margin-bottom: 64px;
}

.carousel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 48px;
    margin-bottom: 24px;
}

@media (max-width: 600px) {
    .carousel-header {
        padding: 0 16px;
    }
}

.carousel-title {
    font-size: 24px;
    font-weight: 500;
    color: #111111;
}
```

### Navigation Arrows (Header Position)

```css
.carousel-nav {
    display: flex;
    gap: 8px;
}

.carousel-nav-btn {
    width: 48px;
    height: 48px;
    border: none;
    background-color: #E5E5E5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.2s ease;
}

.carousel-nav-btn:hover {
    background-color: #CCCCCC;
}

.carousel-nav-btn:focus {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

.carousel-nav-btn:disabled {
    background-color: #F5F5F5;
    cursor: not-allowed;
}

.carousel-nav-btn:disabled svg {
    fill: #CCCCCC;
}

.carousel-nav-btn svg {
    width: 24px;
    height: 24px;
    fill: #111111;
}
```

### Inline Arrows (Overlay Position)

```css
.inline-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 48px;
    height: 48px;
    border: none;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 3;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: background-color 0.2s ease, transform 0.2s ease;
}

.inline-arrow:hover {
    background-color: #FFFFFF;
    transform: translateY(-50%) scale(1.05);
}

.inline-arrow:focus {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

.inline-arrow svg {
    width: 24px;
    height: 24px;
    fill: #111111;
}

.inline-arrow-left {
    left: 24px;
}

.inline-arrow-right {
    right: 24px;
}
```

### Carousel Track

```css
.carousel-container {
    position: relative;
    overflow: hidden;
}

.carousel-track {
    display: flex;
    gap: 16px;
    padding: 0 48px;
    overflow-x: auto;
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.carousel-track::-webkit-scrollbar {
    display: none;
}

@media (max-width: 600px) {
    .carousel-track {
        padding: 0 16px;
        gap: 12px;
    }
}
```

### Carousel Items

```css
.carousel-item {
    flex: 0 0 calc(25% - 12px);
    scroll-snap-align: start;
    min-width: 250px;
}

@media (max-width: 1200px) {
    .carousel-item {
        flex: 0 0 calc(33.333% - 11px);
    }
}

@media (max-width: 900px) {
    .carousel-item {
        flex: 0 0 calc(50% - 8px);
    }
}

@media (max-width: 600px) {
    .carousel-item {
        flex: 0 0 80%;
    }
}
```

### Pagination Dots

```css
.carousel-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 24px;
}

.carousel-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #E5E5E5;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.carousel-dot.active {
    background-color: #111111;
}

.carousel-dot:hover:not(.active) {
    background-color: #CCCCCC;
}

.carousel-dot:focus {
    outline: 2px solid #111111;
    outline-offset: 2px;
}
```

### Gradient Overlays

```css
.carousel-gradient-left,
.carousel-gradient-right {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 80px;
    z-index: 2;
    pointer-events: none;
}

.carousel-gradient-left {
    left: 0;
    background: linear-gradient(to right, #FFFFFF 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.2s ease;
}

.carousel-gradient-left.visible {
    opacity: 1;
}

.carousel-gradient-right {
    right: 0;
    background: linear-gradient(to left, #FFFFFF 0%, transparent 100%);
}
```

## Spacing Diagram

```
Carousel Layout:

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                          │
│  ├─48px─┤ Section Title                                      ◄  ►  ├─48px─┤             │
│         │                                                    └─8px─┘                    │
│         ▲                                                    48x48px                    │
│         24px                                                                            │
│         ▼                                                                               │
│  ├─48px─┤                                                                    ├─48px─┤   │
│         ┌──────────────┐├─16px─┤┌──────────────┐├─16px─┤┌──────────────┐               │
│         │              │       │              │       │              │               │
│         │    ITEM      │       │    ITEM      │       │    ITEM      │               │
│         │              │       │              │       │              │               │
│         └──────────────┘       └──────────────┘       └──────────────┘               │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘

Arrow Button:
┌────────────────┐
│                │
│    48x48px     │
│  ┌──────────┐  │
│  │  24x24   │  │  Icon centered
│  │   SVG    │  │
│  └──────────┘  │
│                │
└────────────────┘

Pagination Dots:
┌────────────────────────────────────────┐
│                                        │
│         ●    ●    ○    ○    ○          │
│         │    │                         │
│         └─8px─┘                        │
│         8x8px dots                     │
│                                        │
└────────────────────────────────────────┘
```

## Responsive Breakpoints

| Breakpoint | Items Visible | Padding | Gap |
|------------|---------------|---------|-----|
| ≥1200px | 4 | 48px | 16px |
| 900-1199px | 3 | 48px | 16px |
| 600-899px | 2 | 24px | 12px |
| <600px | 1.2 (partial) | 16px | 12px |

## Animation Specifications

| Property | Duration | Easing | Usage |
|----------|----------|--------|-------|
| scroll-behavior | smooth | browser default | Track scrolling |
| Arrow background | 200ms | ease | Hover state |
| Arrow transform | 200ms | ease | Hover scale |
| Dot background | 200ms | ease | State change |
| Gradient opacity | 200ms | ease | Show/hide |

## Scroll Behavior

```css
/* Scroll Snap */
.carousel-track {
    scroll-snap-type: x mandatory;
}

.carousel-item {
    scroll-snap-align: start;
}

/* Smooth Scrolling */
.carousel-track {
    scroll-behavior: smooth;
}

/* JavaScript scroll control */
const scrollAmount = itemWidth + gap;
track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
```

## Accessibility

```css
/* Focus management */
.carousel-nav-btn:focus-visible,
.inline-arrow:focus-visible,
.carousel-dot:focus-visible {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

/* Screen reader text */
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

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .carousel-track {
        scroll-behavior: auto;
    }

    .carousel-nav-btn,
    .inline-arrow,
    .carousel-dot {
        transition: none;
    }
}
```

## ARIA Attributes

```html
<div class="carousel" role="region" aria-label="Product carousel">
    <button class="carousel-nav-btn" aria-label="Previous slide">
    <button class="carousel-nav-btn" aria-label="Next slide">

    <div class="carousel-track" role="list">
        <div class="carousel-item" role="listitem">
    </div>

    <div class="carousel-dots" role="tablist">
        <button class="carousel-dot" role="tab" aria-selected="true" aria-label="Slide 1">
        <button class="carousel-dot" role="tab" aria-selected="false" aria-label="Slide 2">
    </div>
</div>
```

## Z-Index Stack

| Element | Z-Index |
|---------|---------|
| Carousel Track | 0 (default) |
| Gradient Overlays | 2 |
| Inline Arrows | 3 |
