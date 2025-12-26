# Color Swatch Selector CSS Specification

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--swatch-border` | `#E5E5E5` | Unselected border |
| `--swatch-border-selected` | `#111111` | Selected border |
| `--swatch-focus` | `#111111` | Focus outline |

### Dimensions

| Token | Value |
|-------|-------|
| `--swatch-size` | 28px |
| `--swatch-gap` | 12px |
| `--swatch-border-width` | 1px |
| `--swatch-border-width-selected` | 2px |

## Color Palette

| Color Name | Value |
|------------|-------|
| Black | `#111111` |
| White | `#FFFFFF` |
| Gray | `#757575` |
| Red | `#9E3500` |
| Blue | `#0055A6` |
| Green | `#2E7D32` |
| Pink | `#E91E63` |
| Orange | `#FF9800` |
| Yellow | `#FFEB3B` |
| Purple | `#9C27B0` |
| Brown | `#795548` |
| Navy | `#1A237E` |

## Component Structure

```css
.color-swatch-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.color-swatch {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid #E5E5E5;
    cursor: pointer;
    transition: transform 0.15s ease;
    position: relative;
}

.color-swatch:hover {
    transform: scale(1.1);
}

.color-swatch:focus {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

.color-swatch--selected {
    border: 2px solid #111111;
}

/* Tooltip */
.color-swatch::before {
    content: attr(data-color);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    padding: 4px 8px;
    background-color: #FFFFFF;
    border: 1px solid #E5E5E5;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.15s ease;
    margin-bottom: 4px;
}

.color-swatch:hover::before {
    opacity: 1;
    visibility: visible;
}
```

## Complete CSS

```css
/* Color Swatch Grid */
.color-swatch-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

/* Color Swatch Button */
.color-swatch {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid #E5E5E5;
    cursor: pointer;
    transition: transform 0.15s ease;
    position: relative;
    padding: 0;
    background: none;
}

.color-swatch:hover {
    transform: scale(1.1);
}

.color-swatch:focus {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

.color-swatch:focus:not(:focus-visible) {
    outline: none;
}

.color-swatch:focus-visible {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

/* Selected State */
.color-swatch--selected {
    border: 2px solid #111111;
}

/* Color fills */
.color-swatch--black { background-color: #111111; }
.color-swatch--white { background-color: #FFFFFF; }
.color-swatch--gray { background-color: #757575; }
.color-swatch--red { background-color: #9E3500; }
.color-swatch--blue { background-color: #0055A6; }
.color-swatch--green { background-color: #2E7D32; }
.color-swatch--pink { background-color: #E91E63; }
.color-swatch--orange { background-color: #FF9800; }
.color-swatch--yellow { background-color: #FFEB3B; }
.color-swatch--purple { background-color: #9C27B0; }
.color-swatch--brown { background-color: #795548; }
.color-swatch--navy { background-color: #1A237E; }

/* Multi-color */
.color-swatch--multi {
    background: linear-gradient(135deg,
        #FF6B6B 0%, #FF6B6B 25%,
        #4ECDC4 25%, #4ECDC4 50%,
        #45B7D1 50%, #45B7D1 75%,
        #96CEB4 75%, #96CEB4 100%
    );
}

/* Tooltip */
.color-swatch[data-color]::before {
    content: attr(data-color);
    position: absolute;
    bottom: calc(100% + 4px);
    left: 50%;
    transform: translateX(-50%);
    padding: 4px 8px;
    background-color: #FFFFFF;
    border: 1px solid #E5E5E5;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 12px;
    color: #111111;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.15s ease;
    pointer-events: none;
    z-index: 10;
}

.color-swatch:hover[data-color]::before {
    opacity: 1;
    visibility: visible;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .color-swatch {
        transition: none;
    }
    .color-swatch[data-color]::before {
        transition: none;
    }
}
```

## Spacing Diagram

```
Color Swatch Layout:

┌────────────────────────────────────────────────────────┐
│                                                        │
│  display: flex                                         │
│  flex-wrap: wrap                                       │
│  gap: 12px                                             │
│                                                        │
│  ┌────────┐  ├─12px─┤  ┌────────┐  ├─12px─┤  ┌────────┐│
│  │        │           │        │           │        ││
│  │  28px  │           │  28px  │           │  28px  ││
│  │        │           │        │           │        ││
│  └────────┘           └────────┘           └────────┘│
│                                                        │
│  ├──────────────12px row gap──────────────┤            │
│                                                        │
│  ┌────────┐           ┌────────┐           ┌────────┐│
│  │  28px  │           │  28px  │           │  28px  ││
│  └────────┘           └────────┘           └────────┘│
│                                                        │
└────────────────────────────────────────────────────────┘

Individual Swatch:
┌──────────────────────┐
│                      │
│  width: 28px         │
│  height: 28px        │
│  border-radius: 50%  │
│  border: 1px solid   │
│                      │
└──────────────────────┘
```

## Accessibility

```html
<div class="color-swatch-grid" role="group" aria-label="Filter by color">
    <button
        class="color-swatch color-swatch--black"
        data-color="Black"
        aria-label="Black"
        aria-pressed="false"
    ></button>
    <button
        class="color-swatch color-swatch--white color-swatch--selected"
        data-color="White"
        aria-label="White"
        aria-pressed="true"
    ></button>
    <!-- more swatches -->
</div>
```

- Use `role="group"` with `aria-label` for the container
- Use `aria-pressed` to indicate selection state
- Use `aria-label` for color name on each swatch
