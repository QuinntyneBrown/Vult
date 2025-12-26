# Color Swatch Selector Wireframes

## Color Swatch Grid

```
┌────────────────────────────────────────┐
│                                        │
│  ●   ●   ●   ●   ●   ●                │
│  Blk Wht Gry Red Blu Grn              │
│                                        │
│  ●   ●   ●   ●   ●   ●                │
│  Pnk Org Ylw Prp Brn Nvy              │
│                                        │
│  ◐                                     │
│  Multi                                 │
│                                        │
└────────────────────────────────────────┘

Swatch size: 28x28px
Gap: 12px
Wraps automatically
```

## Swatch States

### Unselected
```
┌────┐
│ ●  │  Border: 1px solid #E5E5E5
│    │  Fill: actual color
└────┘
28x28px circle
```

### Selected
```
┌────┐
│ ●  │  Border: 2px solid #111111
│    │  Fill: actual color
└────┘
```

### Hover
```
┌────┐
│ ●  │  Transform: scale(1.1)
│    │
└────┘
```

### Focus
```
╔════╗
║ ●  ║  Outline: 2px solid #111111
║    ║  Outline-offset: 2px
╚════╝
```

## White/Light Color Handling

```
White swatch:
┌────┐
│ ○  │  Border: 1px solid #E5E5E5 (always visible)
│    │  Fill: #FFFFFF
└────┘
```

## Multi-Color Swatch

```
┌────┐
│ ◐  │  Half-and-half or gradient pattern
│    │  Represents multi-color option
└────┘
```

## In Filter Section

```
┌────────────────────────────────────────┐
│  Color                              ▲  │
│ ────────────────────────────────────── │
│                                        │
│  ●   ●   ●   ●   ●   ●                │
│                                        │
│  ●   ●   ●   ●   ●   ●                │
│                                        │
└────────────────────────────────────────┘

Padding: 16px
Gap between swatches: 12px
```

## Spacing Details

```
Color Swatch Grid:

┌────────────────────────────────────────────────┐
│ ├──16px──┤                        ├──16px──┤   │
│                                                │
│ ┌──────┐  ├─12px─┤  ┌──────┐  ├─12px─┤  ┌──────┐
│ │ 28px │           │ 28px │           │ 28px │
│ │      │           │      │           │      │
│ └──────┘           └──────┘           └──────┘
│                                                │
│ ├─────12px vertical gap─────┤                  │
│                                                │
│ ┌──────┐           ┌──────┐           ┌──────┐
│ │ 28px │           │ 28px │           │ 28px │
│ └──────┘           └──────┘           └──────┘
│                                                │
└────────────────────────────────────────────────┘

Swatch: 28x28px circle
Gap: 12px horizontal and vertical
Border: 1px solid #E5E5E5 (unselected)
Selected border: 2px solid #111111
```

## Tooltip on Hover

```
        ┌─────────┐
        │  Black  │  ← Tooltip
        └────┬────┘
             │
         ┌───┴───┐
         │   ●   │
         │       │
         └───────┘

Tooltip: 12px font, #111111 text
Background: #FFFFFF
Border: 1px solid #E5E5E5
Padding: 4px 8px
```
