# Product Image Gallery - CSS Specification

## Design Tokens

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--gallery-border-default` | `#e5e5e5` | Default thumbnail border |
| `--gallery-border-selected` | `#111111` | Selected thumbnail border |
| `--gallery-bg-skeleton` | `#f0f0f0` | Skeleton loading background |
| `--gallery-dot-inactive` | `#cccccc` | Inactive dot indicator |
| `--gallery-dot-active` | `#111111` | Active dot indicator |

### Spacing
| Token | Value | Usage |
|-------|-------|-------|
| `--gallery-gap` | `16px` | Gap between thumbnails and main image |
| `--gallery-thumbnail-gap` | `8px` | Gap between thumbnails |
| `--gallery-dot-gap` | `8px` | Gap between dot indicators |
| `--gallery-mobile-padding` | `16px` | Horizontal padding on mobile |

### Sizing
| Token | Value | Usage |
|-------|-------|-------|
| `--gallery-thumbnail-size-desktop` | `70px` | Desktop thumbnail dimensions |
| `--gallery-thumbnail-size-mobile` | `125px` | Mobile thumbnail dimensions |
| `--gallery-main-width` | `535px` | Main image width (desktop) |
| `--gallery-main-height` | `669px` | Main image height (desktop) |
| `--gallery-dot-size` | `8px` | Dot indicator diameter |

### Transitions
| Token | Value | Usage |
|-------|-------|-------|
| `--gallery-transition-fast` | `0.15s ease` | Thumbnail hover/scale |
| `--gallery-transition-slide` | `0.3s ease-out` | Image slide animation |

---

## Component Styles

### Container
```css
.product-image-gallery {
  display: flex;
  gap: var(--gallery-gap, 16px);
  max-width: 640px;
}
```

### Thumbnail Container
```css
.gallery-thumbnails {
  display: flex;
  flex-direction: column;
  gap: var(--gallery-thumbnail-gap, 8px);
  flex-shrink: 0;
}
```

### Individual Thumbnail
```css
.gallery-thumbnail {
  width: var(--gallery-thumbnail-size-desktop, 70px);
  height: var(--gallery-thumbnail-size-desktop, 70px);
  border: 1px solid var(--gallery-border-default, #e5e5e5);
  background-color: transparent;
  cursor: pointer;
  overflow: hidden;
  padding: 0;
  transition:
    transform var(--gallery-transition-fast, 0.15s ease),
    border-color var(--gallery-transition-fast, 0.15s ease);
}

.gallery-thumbnail:hover {
  transform: scale(1.05);
}

.gallery-thumbnail:focus {
  outline: 2px solid var(--gallery-border-selected, #111111);
  outline-offset: 2px;
}

.gallery-thumbnail:focus:not(:focus-visible) {
  outline: none;
}

.gallery-thumbnail:focus-visible {
  outline: 2px solid var(--gallery-border-selected, #111111);
  outline-offset: 2px;
}

.gallery-thumbnail--selected {
  border: 2px solid var(--gallery-border-selected, #111111);
}

.gallery-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
```

### Main Image Container
```css
.gallery-main {
  flex: 1;
  position: relative;
}

.gallery-main-image {
  width: var(--gallery-main-width, 535px);
  height: var(--gallery-main-height, 669px);
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.gallery-main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
```

### Dot Indicators
```css
.gallery-dots {
  display: none;
  justify-content: center;
  gap: var(--gallery-dot-gap, 8px);
  margin-top: 16px;
}

.gallery-dot {
  width: var(--gallery-dot-size, 8px);
  height: var(--gallery-dot-size, 8px);
  border-radius: 50%;
  background-color: var(--gallery-dot-inactive, #cccccc);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: background-color var(--gallery-transition-fast, 0.15s ease);
}

.gallery-dot:hover {
  background-color: #999999;
}

.gallery-dot--active {
  background-color: var(--gallery-dot-active, #111111);
}

.gallery-dot:focus {
  outline: 2px solid var(--gallery-border-selected, #111111);
  outline-offset: 2px;
}
```

---

## Responsive Breakpoints

### Mobile (< 768px)
```css
@media (max-width: 768px) {
  .product-image-gallery {
    flex-direction: column;
    max-width: 100%;
  }

  .gallery-thumbnails {
    flex-direction: row;
    overflow-x: auto;
    padding: 0 var(--gallery-mobile-padding, 16px) 8px;
    order: 2;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .gallery-thumbnails::-webkit-scrollbar {
    display: none;
  }

  .gallery-thumbnail {
    width: var(--gallery-thumbnail-size-mobile, 125px);
    height: var(--gallery-thumbnail-size-mobile, 125px);
    flex-shrink: 0;
  }

  .gallery-main {
    order: 1;
  }

  .gallery-main-image {
    width: 100%;
    height: auto;
    aspect-ratio: 1 / 1.25;
  }

  .gallery-dots {
    display: flex;
  }
}
```

---

## Animation Keyframes

### Skeleton Loading
```css
@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}
```

### Image Slide (for swipe)
```css
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-in-left {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

---

## Accessibility

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .gallery-thumbnail,
  .gallery-dot {
    transition: none;
  }

  .skeleton {
    animation: none;
    background: #f0f0f0;
  }
}
```

### High Contrast Mode
```css
@media (prefers-contrast: high) {
  .gallery-thumbnail {
    border-width: 2px;
  }

  .gallery-thumbnail--selected {
    border-width: 3px;
  }

  .gallery-dot {
    border: 1px solid currentColor;
  }
}
```

---

## Spacing Diagram

```
Desktop Layout:
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ◄───── 70px ─────►  ◄────────── 16px ──────────►                  │
│                                                                     │
│  ┌────────────────┐  ┌──────────────────────────────────────────┐  │
│  │                │  │                                          │  │
│  │   Thumbnail    │  │                                          │  │
│  │    70 x 70     │  │                                          │  │
│  └────────────────┘  │                                          │  │
│          ▲           │                                          │  │
│       8px│           │              Main Image                  │  │
│          ▼           │              535 x 669                   │  │
│  ┌────────────────┐  │                                          │  │
│  │                │  │                                          │  │
│  │   Thumbnail    │  │                                          │  │
│  │    70 x 70     │  │                                          │  │
│  └────────────────┘  │                                          │  │
│                      │                                          │  │
│                      └──────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Mobile Layout:
┌────────────────────────────────────────────────┐
│ ◄─16px─►                           ◄─16px─►    │
│ ┌────────────────────────────────────────────┐ │
│ │                                            │ │
│ │              Main Image                    │ │
│ │           100% x auto (1:1.25)             │ │
│ │                                            │ │
│ └────────────────────────────────────────────┘ │
│                      ▲                         │
│                  16px│                         │
│                      ▼                         │
│           ○  ○  ●  ○  ○  (8px gap)            │
│                      ▲                         │
│                  16px│                         │
│                      ▼                         │
│ ◄─16px─► ┌───┐ 8px ┌───┐ 8px ┌───┐           │
│          │125│     │125│     │125│→ scroll    │
│          └───┘     └───┘     └───┘            │
│                                                │
└────────────────────────────────────────────────┘
```
