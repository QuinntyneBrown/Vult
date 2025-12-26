# Checkbox Filter Wireframes

## Checkbox States

### Unchecked
```
┌─────────────────────────────────┐
│                                 │
│  □  Option Label                │
│                                 │
└─────────────────────────────────┘

Checkbox: 18x18px, 1.5px border
Border: #111111
Background: transparent
```

### Checked
```
┌─────────────────────────────────┐
│                                 │
│  ☑  Option Label                │
│  ▲                              │
│  │ Filled background            │
│  │ White checkmark              │
│                                 │
└─────────────────────────────────┘

Background: #111111
Checkmark: #FFFFFF
```

### Hover
```
┌─────────────────────────────────┐
│                                 │
│  □  Option Label                │
│  ▲                              │
│  │ Text color lightens          │
│                                 │
└─────────────────────────────────┘

Text: #757575
```

### Focus
```
┌─────────────────────────────────┐
│                                 │
│  ╔═╗  Option Label              │
│  ║□║                            │
│  ╚═╝                            │
│  ▲                              │
│  │ Focus ring: 2px solid        │
│                                 │
└─────────────────────────────────┘

Outline: 2px solid #111111
Outline-offset: 2px
```

### Disabled
```
┌─────────────────────────────────┐
│                                 │
│  □  Option Label                │
│  ▲    ▲                         │
│  │    │ Grayed out              │
│  │ Border #CCCCCC               │
│                                 │
└─────────────────────────────────┘

Border: #CCCCCC
Text: #CCCCCC
Cursor: not-allowed
```

## With Count

```
┌─────────────────────────────────┐
│                                 │
│  □  Nike                 (124)  │
│      ▲                    ▲     │
│      │                    │     │
│      Label         Count (gray) │
│                                 │
└─────────────────────────────────┘

Count: 14px, #757575
```

## Filter Group

```
┌─────────────────────────────────┐
│  Brand                       ▲  │
│ ────────────────────────────── │
│                                 │
│  ☑  Nike                 (124)  │
│                                 │
│  □  Jordan                (56)  │
│                                 │
│  ☑  Nike Sportswear       (89)  │
│                                 │
│  □  ACG                   (23)  │
│                                 │
│  □  NikeLab               (12)  │
│                                 │
│  + 12 More                      │
│                                 │
└─────────────────────────────────┘

Row height: 40px (touch-friendly)
Padding: 8px 0
```

## Spacing Details

```
Checkbox Option Row:

┌─────────────────────────────────────────┐
│ ├──16px──┤                   ├──16px──┤ │
│ ▲                                       │
│ 8px                                     │
│ ▼                                       │
│ ┌────┐                                  │
│ │ □  │ ├─12px─┤ Option Label     (123) │
│ │18px│                                  │
│ └────┘                                  │
│ ▲                                       │
│ 8px                                     │
│ ▼                                       │
└─────────────────────────────────────────┘

Checkbox: 18x18px
Gap to label: 12px
Row height: 40px (8px + 24px + 8px)
Font: 16px, line-height 1.5
```
