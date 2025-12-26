# Badge Wireframes

## Badge Variants

### Default Badge
```
┌───────────┐
│ Just In   │
└───────────┘

Background: #FFFFFF
Text: #111111
Padding: 4px 8px
Font: 12px, 500 weight
```

### Sale Badge
```
┌───────────┐
│   Sale    │
└───────────┘

Background: #9E3500 (Nike sale orange)
Text: #FFFFFF
```

### Member Badge
```
┌─────────────────┐
│ Member Access   │
└─────────────────┘

Background: #111111
Text: #FFFFFF
```

### Sustainable Badge
```
┌──────────────┐
│ Sustainable  │
└──────────────┘

Background: #2E7D32
Text: #FFFFFF
```

## Badge on Product Card

```
┌─────────────────────────────────────┐
│ ┌───────────┐                  ♡   │
│ │ Just In   │ ← Badge             │
│ └───────────┘                      │
│    ┌───────────────────────────┐   │
│    │                           │   │
│    │      PRODUCT IMAGE        │   │
│    │                           │   │
│    │                           │   │
│    └───────────────────────────┘   │
│                                    │
├────────────────────────────────────┤
│  Product Name                      │
│  Category                          │
│  $XXX                              │
└────────────────────────────────────┘

Position: absolute
Top: 12px
Left: 12px
Z-index: 2
```

## Multiple Badges

```
┌─────────────────────────────────────┐
│ ┌───────────┐                  ♡   │
│ │   Sale    │                      │
│ └───────────┘                      │
│ ┌─────────────────┐                │
│ │ Member Access   │                │
│ └─────────────────┘                │
│    ├─4px gap─┤                     │
│                                    │
│    ┌───────────────────────────┐   │
│    │      PRODUCT IMAGE        │   │
│    └───────────────────────────┘   │
│                                    │
└────────────────────────────────────┘

Stack: vertical, 4px gap
```

## Spacing Details

```
Badge Structure:

┌──────────────────────┐
│ ├─8px─┤      ├─8px─┤ │
│ ▲                    │
│ 4px                  │
│ ▼                    │
│ Badge Text           │ ← 12px font, 500 weight
│ ▲                    │
│ 4px                  │
│ ▼                    │
└──────────────────────┘

Height: 20px (4px + 12px line-height + 4px)
Min-width: auto (content based)
```

## All Badge Types

```
┌───────────┐  ┌───────────┐  ┌─────────────────┐
│ Just In   │  │   Sale    │  │ Member Access   │
└───────────┘  └───────────┘  └─────────────────┘
   White          Orange          Black

┌──────────────┐  ┌───────────┐  ┌───────────┐
│ Best Seller  │  │ Sustainable│  │  Limited  │
└──────────────┘  └───────────┘  └───────────┘
    White            Green          White
```
