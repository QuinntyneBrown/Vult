# Badge CSS Specification

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--badge-default-bg` | `#FFFFFF` | Default badge background |
| `--badge-default-text` | `#111111` | Default badge text |
| `--badge-sale-bg` | `#9E3500` | Sale badge background |
| `--badge-sale-text` | `#FFFFFF` | Sale badge text |
| `--badge-member-bg` | `#111111` | Member badge background |
| `--badge-member-text` | `#FFFFFF` | Member badge text |
| `--badge-sustainable-bg` | `#2E7D32` | Sustainable badge background |
| `--badge-sustainable-text` | `#FFFFFF` | Sustainable badge text |

### Typography

| Element | Font Family | Size | Weight | Line Height | Text Transform |
|---------|-------------|------|--------|-------------|----------------|
| Badge | Helvetica Neue | 12px | 500 | 1 | none |

### Spacing

| Token | Value |
|-------|-------|
| `--badge-padding` | 4px 8px |
| `--badge-stack-gap` | 4px |
| `--badge-position-top` | 12px |
| `--badge-position-left` | 12px |

## Component Structure

```css
.badge {
    display: inline-block;
    padding: 4px 8px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
    background-color: #FFFFFF;
    color: #111111;
}

/* Variants */
.badge--sale {
    background-color: #9E3500;
    color: #FFFFFF;
}

.badge--member {
    background-color: #111111;
    color: #FFFFFF;
}

.badge--sustainable {
    background-color: #2E7D32;
    color: #FFFFFF;
}

.badge--limited {
    background-color: #FFFFFF;
    color: #111111;
    border: 1px solid #111111;
}
```

## Positioning on Card

```css
.card-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 2;
}

/* Multiple badges container */
.card-badges {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 4px;
}
```

## Complete CSS

```css
/* Badge Component */
.badge {
    display: inline-block;
    padding: 4px 8px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
    background-color: #FFFFFF;
    color: #111111;
    white-space: nowrap;
}

/* Variants */
.badge--sale {
    background-color: #9E3500;
    color: #FFFFFF;
}

.badge--member {
    background-color: #111111;
    color: #FFFFFF;
}

.badge--sustainable {
    background-color: #2E7D32;
    color: #FFFFFF;
}

.badge--limited {
    background-color: #FFFFFF;
    color: #111111;
    border: 1px solid #111111;
}

.badge--best-seller {
    background-color: #FFFFFF;
    color: #111111;
}

/* Card positioning */
.card-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 2;
}

/* Multiple badges */
.card-badges {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
}
```

## Spacing Diagram

```
Badge Layout:

┌──────────────────────┐
│ ├─8px─┤      ├─8px─┤ │
│ ▲                    │
│ 4px                  │
│ ▼                    │
│ BADGE TEXT           │ ← 12px font, 500 weight, line-height: 1
│ ▲                    │
│ 4px                  │
│ ▼                    │
└──────────────────────┘

Total height: 4px + 12px + 4px = 20px

On Card:
┌─────────────────────────────────────┐
│ ├─12px─┤                            │
│ ▲                                   │
│ 12px                                │
│ ▼                                   │
│ ┌───────────┐                       │
│ │  Badge    │                       │
│ └───────────┘                       │
│                                     │
```

## Accessibility

- All badge color combinations meet WCAG AA contrast ratio (4.5:1)
- Contrast ratios:
  - Default (white/black): 21:1
  - Sale (#9E3500/#FFFFFF): 5.7:1
  - Member (black/white): 21:1
  - Sustainable (#2E7D32/#FFFFFF): 4.5:1
