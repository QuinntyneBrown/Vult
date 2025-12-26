# Result Counter CSS Specification

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--counter-text` | `#111111` | Counter text color |
| `--counter-skeleton` | `#E5E5E5` | Loading skeleton |

### Typography

| Element | Font Family | Size | Weight | Line Height | Color |
|---------|-------------|------|--------|-------------|-------|
| Counter | Helvetica Neue | 16px | 500 | 1.5 | #111111 |

## Component Structure

```css
.result-counter {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    color: #111111;
}

.result-counter__number {
    font-variant-numeric: tabular-nums;
}

/* Loading state */
.result-counter--loading .result-counter__number {
    display: inline-block;
    width: 40px;
    height: 16px;
    background-color: #E5E5E5;
    border-radius: 2px;
    vertical-align: middle;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

/* Transition for count changes */
.result-counter--animated {
    transition: opacity 0.2s ease;
}

.result-counter--updating {
    opacity: 0.5;
}
```

## Complete CSS

```css
/* Result Counter */
.result-counter {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    color: #111111;
}

.result-counter__number {
    font-variant-numeric: tabular-nums;
}

/* Loading skeleton */
.result-counter--loading .result-counter__number {
    display: inline-block;
    width: 40px;
    height: 16px;
    background-color: #E5E5E5;
    border-radius: 2px;
    vertical-align: middle;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

/* Count update animation */
.result-counter--animated {
    transition: opacity 0.2s ease;
}

.result-counter--updating {
    opacity: 0.5;
}

/* Responsive */
@media (max-width: 768px) {
    .result-counter {
        font-size: 14px;
    }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .result-counter--loading .result-counter__number {
        animation: none;
    }

    .result-counter--animated {
        transition: none;
    }
}
```

## Accessibility

```html
<p class="result-counter" role="status" aria-live="polite">
    <span class="result-counter__number">234</span> Results
</p>
```

- Use `role="status"` and `aria-live="polite"` for screen reader announcements
- Updates are announced when count changes
