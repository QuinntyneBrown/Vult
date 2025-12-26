# Product Details Accordion - CSS Specification

## Design Tokens

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--accordion-text-primary` | `#111111` | Title and content text |
| `--accordion-text-secondary` | `#757575` | Secondary/hover text |
| `--accordion-border` | `#e5e5e5` | Border between sections |
| `--accordion-chevron` | `#111111` | Chevron icon color |
| `--accordion-link` | `#111111` | Link text color |
| `--accordion-link-hover` | `#757575` | Link hover color |

### Typography
| Token | Value | Usage |
|-------|-------|-------|
| `--accordion-font-family` | `'Helvetica Neue', Helvetica, Arial, sans-serif` | All text |
| `--accordion-title-size` | `18px` | Section title size |
| `--accordion-title-weight` | `500` | Section title weight |
| `--accordion-content-size` | `16px` | Content text size |
| `--accordion-content-line-height` | `1.7` | Content line height |

### Sizing
| Token | Value | Usage |
|-------|-------|-------|
| `--accordion-chevron-size` | `24px` | Chevron icon size |
| `--accordion-header-padding` | `20px 0` | Header padding |
| `--accordion-content-padding` | `24px` | Content padding-bottom |

### Transitions
| Token | Value | Usage |
|-------|-------|-------|
| `--accordion-transition` | `0.2s ease` | Chevron rotation, panel expansion |
| `--accordion-transition-opacity` | `0.15s ease` | Opacity changes |

---

## Component Styles

### Container
```css
.accordion {
  border-top: 1px solid var(--accordion-border, #e5e5e5);
}
```

### Accordion Item
```css
.accordion-item {
  border-bottom: 1px solid var(--accordion-border, #e5e5e5);
}
```

### Header Button
```css
.accordion-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--accordion-header-padding, 20px 0);
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: var(--accordion-font-family, 'Helvetica Neue', Helvetica, Arial, sans-serif);
  transition: opacity var(--accordion-transition-opacity, 0.15s ease);
}

.accordion-header:hover .accordion-title {
  text-decoration: underline;
}

.accordion-header:focus {
  outline: none;
}

.accordion-header:focus-visible {
  outline: 2px solid var(--accordion-text-primary, #111111);
  outline-offset: 2px;
}
```

### Title
```css
.accordion-title {
  font-size: var(--accordion-title-size, 18px);
  font-weight: var(--accordion-title-weight, 500);
  color: var(--accordion-text-primary, #111111);
  flex: 1;
  margin: 0;
}
```

### Chevron Icon
```css
.accordion-chevron {
  width: var(--accordion-chevron-size, 24px);
  height: var(--accordion-chevron-size, 24px);
  stroke: var(--accordion-chevron, #111111);
  stroke-width: 1.5;
  fill: none;
  transition: transform var(--accordion-transition, 0.2s ease);
  flex-shrink: 0;
}

.accordion-item.is-expanded .accordion-chevron {
  transform: rotate(180deg);
}
```

### Panel (with CSS Grid animation)
```css
.accordion-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--accordion-transition, 0.2s ease);
}

.accordion-item.is-expanded .accordion-panel {
  grid-template-rows: 1fr;
}
```

### Content Container
```css
.accordion-content {
  overflow: hidden;
}

.accordion-content-inner {
  padding-bottom: var(--accordion-content-padding, 24px);
  font-size: var(--accordion-content-size, 16px);
  color: var(--accordion-text-primary, #111111);
  line-height: var(--accordion-content-line-height, 1.7);
}
```

### Content Elements
```css
.accordion-content-inner p {
  margin-bottom: 12px;
}

.accordion-content-inner p:last-child {
  margin-bottom: 0;
}

.accordion-content-inner ul {
  list-style: disc;
  padding-left: 20px;
  margin: 12px 0;
}

.accordion-content-inner li {
  margin-bottom: 8px;
}

.accordion-content-inner li:last-child {
  margin-bottom: 0;
}

.accordion-content-inner a {
  color: var(--accordion-link, #111111);
  text-decoration: underline;
  transition: color var(--accordion-transition-opacity, 0.15s ease);
}

.accordion-content-inner a:hover {
  color: var(--accordion-link-hover, #757575);
}
```

### Disabled State
```css
.accordion-header.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.accordion-header.is-disabled:hover .accordion-title {
  text-decoration: none;
}
```

---

## Accessibility

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .accordion-chevron,
  .accordion-panel {
    transition: none;
  }
}
```

### High Contrast
```css
@media (prefers-contrast: high) {
  .accordion-item {
    border-width: 2px;
  }

  .accordion-header:focus-visible {
    outline-width: 3px;
  }
}
```

### Screen Reader Support
```css
/* Visually hidden but accessible summary for screen readers */
.accordion-sr-only {
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
```

---

## Responsive Styles

```css
@media (max-width: 768px) {
  .accordion-title {
    font-size: 16px;
  }

  .accordion-content-inner {
    font-size: 14px;
  }

  .accordion-header {
    padding: 16px 0;
  }

  .accordion-content-inner {
    padding-bottom: 16px;
  }
}
```

---

## Spacing Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ═══════════════════════════════════════════════════════ (top border)      │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │                        ▲                                            │   │
│  │                     20px│ padding-top                               │   │
│  │                        ▼                                            │   │
│  │                                                                     │   │
│  │  Section Title                                        ∨             │   │
│  │  ◄────────────────────────────────────────────►   24x24             │   │
│  │            flex: 1 (takes remaining space)        chevron           │   │
│  │                                                                     │   │
│  │                        ▲                                            │   │
│  │                     20px│ padding-bottom                            │   │
│  │                        ▼                                            │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────── (border)      │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  Content paragraph goes here with line-height: 1.7                  │   │
│  │                                    ▲                                │   │
│  │                                 12px│ margin-bottom                 │   │
│  │                                    ▼                                │   │
│  │  • List item with bullet point                                      │   │
│  │    ◄── 20px padding-left for list                                  │   │
│  │  • Another list item                                                │   │
│  │    ▲                                                               │   │
│  │ 8px│ margin between items                                          │   │
│  │    ▼                                                               │   │
│  │                                                                     │   │
│  │                        ▲                                            │   │
│  │                     24px│ padding-bottom                            │   │
│  │                        ▼                                            │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────── (border)      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

Chevron Rotation:
┌─────────────────────────────────────┐
│                                     │
│  COLLAPSED          EXPANDED        │
│                                     │
│      ∨                  ∧          │
│                                     │
│  rotate(0deg)     rotate(180deg)    │
│                                     │
│  transition: 0.2s ease              │
│                                     │
└─────────────────────────────────────┘

Panel Animation (CSS Grid):
┌─────────────────────────────────────┐
│                                     │
│  Collapsed:                         │
│  grid-template-rows: 0fr           │
│  overflow: hidden on content        │
│                                     │
│  Expanded:                          │
│  grid-template-rows: 1fr           │
│  Content takes natural height       │
│                                     │
│  Transition: 0.2s ease              │
│                                     │
└─────────────────────────────────────┘
```
