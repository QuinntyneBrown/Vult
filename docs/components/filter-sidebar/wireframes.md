# Filter Sidebar Wireframes

## Desktop Layout

### Collapsed State

```
┌────────────────────────────┐
│                            │
│  Filter                    │
│  ━━━━━━                    │
│                            │
├────────────────────────────┤
│  Gender                 ▼  │
├────────────────────────────┤
│  Kids                   ▼  │
├────────────────────────────┤
│  Sale & Offers          ▼  │
├────────────────────────────┤
│  Shop by Price          ▼  │
├────────────────────────────┤
│  Color                  ▼  │
├────────────────────────────┤
│  Brand                  ▼  │
├────────────────────────────┤
│  Size                   ▼  │
├────────────────────────────┤
│  Width                  ▼  │
└────────────────────────────┘

Width: 260px
Section height: 48px
```

### Expanded Section

```
┌────────────────────────────┐
│                            │
│  Filter                    │
│  ━━━━━━                    │
│                            │
├────────────────────────────┤
│  Gender                 ▲  │ ← Expanded (chevron up)
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│  □ Men                     │
│  □ Women                   │
│  □ Unisex                  │
│                            │
├────────────────────────────┤
│  Kids                   ▼  │
├────────────────────────────┤
│  Sale & Offers          ▼  │
├────────────────────────────┤
│  Shop by Price          ▼  │
├────────────────────────────┤
│  Color                  ▲  │ ← Expanded
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│  ● ● ● ● ● ● ●             │
│  ● ● ● ● ● ● ●             │
│                            │
├────────────────────────────┤
│  Brand                  ▼  │
└────────────────────────────┘
```

### With Active Filters

```
┌────────────────────────────┐
│                            │
│  Filter        [Clear All] │
│  ━━━━━━                    │
│                            │
├────────────────────────────┤
│  Gender (2)             ▲  │ ← Count shows selections
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│  ☑ Men                     │ ← Checked
│  ☑ Women                   │ ← Checked
│  □ Unisex                  │
│                            │
├────────────────────────────┤
│  Size (1)               ▲  │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐  │
│  │ 7 │ │ 8 │ │ 9 │ │ 10│  │
│  └───┘ └───┘ └───┘ └───┘  │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐  │
│  │ 11│ │ 12│ │ 13│ │ 14│  │
│  └───┘ └───┘ └───┘ └───┘  │
│  ▲                         │
│  │ Selected: 10            │
│                            │
└────────────────────────────┘
```

## Filter Section Types

### Checkbox Group

```
┌────────────────────────────┐
│  Brand                  ▲  │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│  □ Vult                    │
│  □ Jordan                  │
│  □ Sportswear              │
│  □ ACG                     │
│  □ Lab                     │
│                            │
│  + 12 More                 │ ← Show more link
│                            │
└────────────────────────────┘

Checkbox size: 18x18px
Line height: 40px
Left padding: 16px
```

### Color Swatches

```
┌────────────────────────────┐
│  Color                  ▲  │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│  ●   ●   ●   ●   ●   ●    │ ← Row 1
│  Blk Wht Gry Red Blu Grn  │ ← Labels (optional)
│                            │
│  ●   ●   ●   ●   ●   ●    │ ← Row 2
│  Pnk Org Ylw Prp Brn Nav  │
│                            │
└────────────────────────────┘

Swatch size: 28x28px
Gap: 12px
Rows wrap automatically
```

### Size Grid

```
┌────────────────────────────┐
│  Size                   ▲  │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│  ┌────┐ ┌────┐ ┌────┐     │
│  │ 7  │ │ 7.5│ │ 8  │     │
│  └────┘ └────┘ └────┘     │
│  ┌────┐ ┌────┐ ┌────┐     │
│  │ 8.5│ │ 9  │ │ 9.5│     │
│  └────┘ └────┘ └────┘     │
│  ┌────┐ ┌────┐ ┌────┐     │
│  │ 10 │ │10.5│ │ 11 │     │
│  └────┘ └────┘ └────┘     │
│                            │
└────────────────────────────┘

Button size: 48x48px
Gap: 8px
3 columns in sidebar
```

### Price Range

```
┌────────────────────────────┐
│  Shop by Price          ▲  │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│  □ $0 - $25                │
│  □ $25 - $50               │
│  □ $50 - $100              │
│  □ $100 - $150             │
│  □ Over $150               │
│                            │
└────────────────────────────┘
```

## Spacing Details

```
Filter Sidebar Structure:

┌────────────────────────────┐
│ ├─16px─┤            ├─16px─┤
│                            │
│  Filter        [Clear All] │ ← 24px font-size, 500 weight
│  ▲                         │
│  24px padding              │
│  ▼                         │
├────────────────────────────┤
│ ▲                          │
│ 16px                       │
│ ▼                          │
│  Section Title         ▼   │ ← 16px font, 400 weight
│ ▲                          │
│ 16px                       │
│ ▼                          │
├────────────────────────────┤
│                            │
│  ├─16px─┤                  │
│  □ Filter Option           │ ← 16px font
│  ▲                         │
│  12px gap                  │
│  ▼                         │
│  □ Filter Option           │
│                            │
└────────────────────────────┘

Width: 260px (fixed)
Section header: 48px height
Padding: 16px horizontal
```

## Scrollable Sidebar

```
┌────────────────────────────┐
│  Filter                    │ ← Fixed header
├────────────────────────────┤
│                            │
│  ┌──────────────────────┐  │
│  │                      │  │
│  │  Scrollable content  │  │
│  │                      │  │
│  │  Filter sections     │  │
│  │                      │  │
│  │  ...                 │▐ │ ← Scroll indicator
│  │                      │▐ │
│  │                      │  │
│  └──────────────────────┘  │
│                            │
└────────────────────────────┘

Max height: calc(100vh - header)
Overflow-y: auto
```
