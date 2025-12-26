# Secondary Button CSS Specification

## Design Tokens

### Colors - Dark Theme (Default)

| Token | Value | Usage |
|-------|-------|-------|
| `--btn-secondary-border` | `#111111` | Outlined border color |
| `--btn-secondary-text` | `#111111` | Text color |
| `--btn-secondary-hover-bg` | `rgba(0,0,0,0.05)` | Hover background |
| `--btn-secondary-active-bg` | `rgba(0,0,0,0.1)` | Active background |
| `--btn-secondary-disabled` | `#CCCCCC` | Disabled color |

### Colors - Light Theme (Inverse)

| Token | Value | Usage |
|-------|-------|-------|
| `--btn-secondary-light-border` | `#FFFFFF` | Border color |
| `--btn-secondary-light-text` | `#FFFFFF` | Text color |
| `--btn-secondary-light-hover` | `rgba(255,255,255,0.1)` | Hover background |

### Typography

| Element | Font Family | Size | Weight |
|---------|-------------|------|--------|
| Small | Helvetica Neue | 14px | 500 |
| Medium | Helvetica Neue | 16px | 500 |
| Large | Helvetica Neue | 16px | 500 |

### Dimensions

| Size | Height | Padding | Border Radius |
|------|--------|---------|---------------|
| Small | 36px | 0 20px | 30px |
| Medium | 44px | 0 24px | 30px |
| Large | 52px | 0 32px | 30px |

## Base Component

```css
.btn-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
}

.btn-secondary:focus {
    outline: 2px solid #111111;
    outline-offset: 2px;
}
```

## Style Variants

### Outlined

```css
.btn-secondary.outlined {
    background-color: transparent;
    border: 1.5px solid #111111;
    color: #111111;
    border-radius: 30px;
}

.btn-secondary.outlined:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

.btn-secondary.outlined:active {
    background-color: rgba(0, 0, 0, 0.1);
    transform: scale(0.95);
}
```

### Text (Underlined)

```css
.btn-secondary.text {
    background: none;
    border: none;
    color: #111111;
    text-decoration: underline;
    text-underline-offset: 4px;
    padding: 0;
}

.btn-secondary.text:hover {
    text-decoration-thickness: 2px;
}

.btn-secondary.text:active {
    color: #333333;
}
```

### Ghost

```css
.btn-secondary.ghost {
    background: none;
    border: none;
    color: #111111;
    border-radius: 30px;
}

.btn-secondary.ghost:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

.btn-secondary.ghost:active {
    background-color: rgba(0, 0, 0, 0.1);
}
```

## Size Variants

```css
/* Outlined and Ghost */
.btn-secondary.small {
    height: 36px;
    padding: 0 20px;
    font-size: 14px;
}

.btn-secondary.medium {
    height: 44px;
    padding: 0 24px;
    font-size: 16px;
}

.btn-secondary.large {
    height: 52px;
    padding: 0 32px;
    font-size: 16px;
}

/* Text variant doesn't use fixed height */
.btn-secondary.text.small {
    height: auto;
    padding: 8px 0;
    font-size: 14px;
}

.btn-secondary.text.medium {
    height: auto;
    padding: 12px 0;
    font-size: 16px;
}

.btn-secondary.text.large {
    height: auto;
    padding: 16px 0;
    font-size: 16px;
}
```

## Disabled States

```css
.btn-secondary:disabled,
.btn-secondary.disabled {
    cursor: not-allowed;
}

/* Outlined Disabled */
.btn-secondary.outlined:disabled,
.btn-secondary.outlined.disabled {
    border-color: #CCCCCC;
    color: #CCCCCC;
}

.btn-secondary.outlined:disabled:hover {
    background-color: transparent;
}

/* Text Disabled */
.btn-secondary.text:disabled,
.btn-secondary.text.disabled {
    color: #CCCCCC;
}

/* Ghost Disabled */
.btn-secondary.ghost:disabled,
.btn-secondary.ghost.disabled {
    color: #CCCCCC;
}

.btn-secondary.ghost:disabled:hover {
    background-color: transparent;
}
```

## Light Theme

```css
/* Outlined Light */
.btn-secondary.outlined.light {
    border-color: #FFFFFF;
    color: #FFFFFF;
}

.btn-secondary.outlined.light:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.btn-secondary.outlined.light:focus {
    outline-color: #FFFFFF;
}

/* Text Light */
.btn-secondary.text.light {
    color: #FFFFFF;
}

.btn-secondary.text.light:focus {
    outline-color: #FFFFFF;
}

/* Ghost Light */
.btn-secondary.ghost.light {
    color: #FFFFFF;
}

.btn-secondary.ghost.light:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.btn-secondary.ghost.light:focus {
    outline-color: #FFFFFF;
}
```

## Icons

```css
.btn-secondary svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
    flex-shrink: 0;
}
```

## Spacing Diagram

```
Outlined Button:

┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  ├─ 24px ─┤    Button Text    ├─ 24px ─┤                    │
│                                                              │
│  border: 1.5px solid                                         │
│  border-radius: 30px                                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘


Text Button:

    Button Text
    ───────────
    │         │
    └─ text-underline-offset: 4px


Button Pairing:

┌──────────────────┐ ├─12px─┤ ┌ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│  Primary Button  │          │ Secondary Button │
└──────────────────┘         └ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

## Animation Specifications

| Property | Duration | Easing | Usage |
|----------|----------|--------|-------|
| all | 200ms | ease | General transitions |
| transform | 100ms | ease | Active press |
| text-decoration | 200ms | ease | Text underline |

## Accessibility

```css
/* Focus visible */
.btn-secondary:focus-visible {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

/* Hide focus ring for mouse users */
.btn-secondary:focus:not(:focus-visible) {
    outline: none;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .btn-secondary {
        transition: none;
    }

    .btn-secondary:active {
        transform: none;
    }
}

/* High contrast */
@media (prefers-contrast: high) {
    .btn-secondary.outlined {
        border-width: 2px;
    }

    .btn-secondary:focus {
        outline-width: 3px;
    }
}
```

## Usage Examples

```html
<!-- Outlined button -->
<button class="btn-secondary outlined medium">Learn More</button>

<!-- Text button -->
<button class="btn-secondary text medium">View All</button>

<!-- Ghost button -->
<button class="btn-secondary ghost medium">Cancel</button>

<!-- With icon -->
<button class="btn-secondary outlined medium">
    Learn More
    <svg>...</svg>
</button>

<!-- Light theme -->
<button class="btn-secondary outlined light medium">Learn More</button>

<!-- Disabled -->
<button class="btn-secondary outlined medium" disabled>Learn More</button>

<!-- Link as button -->
<a href="/learn" class="btn-secondary outlined medium">Learn More</a>
```
