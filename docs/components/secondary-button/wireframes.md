# Secondary Button Wireframes

## Style Variants

### Outlined Button

```
┌─────────────────────────────┐
│                             │
│ ┌─────────────────────────┐ │
│ │       Learn More        │ │  Border: 1.5px solid #111111
│ └─────────────────────────┘ │  Background: transparent
│                             │  Text: #111111
└─────────────────────────────┘
```

### Text Button (Underlined)

```
       Learn More
       ──────────                  Text: #111111
                                   Underline: 1px solid
       No border or background
```

### Ghost Button

```
┌─────────────────────────────┐
│                             │
│       Learn More            │  No border
│                             │  Transparent background
│                             │  Text: #111111
└─────────────────────────────┘
```

## Size Variants

### Small

```
┌─────────────────────┐
│                     │
│     Learn More      │  Height: 36px
│                     │  Padding: 8px 20px
│                     │  Font: 14px
└─────────────────────┘
```

### Medium (Default)

```
┌─────────────────────────┐
│                         │
│      Learn More         │  Height: 44px
│                         │  Padding: 12px 24px
│                         │  Font: 16px
└─────────────────────────┘
```

### Large

```
┌─────────────────────────────────┐
│                                 │
│         Learn More              │  Height: 52px
│                                 │  Padding: 16px 32px
│                                 │  Font: 16px
└─────────────────────────────────┘
```

## Interactive States - Outlined

### Default

```
┌─────────────────────────────┐
│                             │
│ ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐ │  Border: #111111
│         Learn More          │  Background: transparent
│ └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘ │  Text: #111111
│                             │
└─────────────────────────────┘
```

### Hover

```
┌─────────────────────────────┐
│                             │
│ ┌░░░░░░░░░░░░░░░░░░░░░░░░░┐ │  Border: #111111
│ ░░░░░   Learn More   ░░░░░░ │  Background: rgba(0,0,0,0.05)
│ └░░░░░░░░░░░░░░░░░░░░░░░░░┘ │  Text: #111111
│                             │
└─────────────────────────────┘
```

### Active/Pressed

```
┌─────────────────────────────┐
│                             │
│ ┌▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓┐ │  Border: #111111
│ ▓▓▓▓▓  Learn More   ▓▓▓▓▓▓▓ │  Background: rgba(0,0,0,0.1)
│ └▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓┘ │  Scale: 0.95
│                             │
└─────────────────────────────┘
```

### Focus

```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
  ┌─────────────────────────┐     2px focus ring
│ │       Learn More        │ │   2px offset
  └─────────────────────────┘
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

### Disabled

```
┌─────────────────────────────┐
│                             │
│ ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐ │  Border: #CCCCCC
│         Learn More          │  Background: transparent
│ └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘ │  Text: #CCCCCC
│                             │  Cursor: not-allowed
└─────────────────────────────┘
```

## Interactive States - Text

### Default

```
    Learn More
    ──────────                    Text: #111111
                                  Underline: 1px solid (optional)
```

### Hover

```
    Learn More
    ══════════                    Text: #111111
                                  Underline: 2px solid (thicker)
```

### Focus

```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
      Learn More                  Focus ring around text
      ──────────
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

### Disabled

```
    Learn More                    Text: #CCCCCC
    ──────────                    Underline: #CCCCCC
```

## Button Pairing

### Primary + Secondary Outlined

```
┌─────────────────────────────┐   ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│                             │           Learn More
│  ███████████████████████████│   └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
│  ███    Shop Now    ███████ │
│  ███████████████████████████│        ├───── 12px gap ─────┤
│                             │
└─────────────────────────────┘
```

### Primary + Secondary Text

```
┌─────────────────────────────┐
│                             │
│  ███████████████████████████│      Learn More
│  ███    Shop Now    ███████ │      ───────────
│  ███████████████████████████│
│                             │      ├───── 12px gap ─────┤
└─────────────────────────────┘
```

## Inverse Theme (On Dark Background)

### Outlined Light

```
Dark Background:

┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
        Learn More              Border: #FFFFFF
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘    Text: #FFFFFF
```

### Text Light

```
Dark Background:

      Learn More                Text: #FFFFFF
      ──────────                Underline: #FFFFFF
```

## Spacing Details

```
Outlined Button:

┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  ├─ 24px ─┤    Learn More    ├─ 24px ─┤                     │
│                                                              │
│  ▲         ▲                 ▲         ▲                    │
│  │        12px              12px       │                    │
│  │         ▼                 ▼         │                    │
│  │                                     │                    │
│  └──────────── border: 1.5px ──────────┘                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Border-radius: 30px (same as primary button)
```
