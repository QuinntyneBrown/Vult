# Typography Display Wireframes

## Type Scale Overview

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                          │
│  DISPLAY 1                                                                               │
│  ██████████████████████████████████████████████████████████████████                     │
│  84px / 800 weight / -2px tracking                                                       │
│                                                                                          │
│  DISPLAY 2                                                                               │
│  ████████████████████████████████████████████████████                                   │
│  64px / 800 weight / -1px tracking                                                       │
│                                                                                          │
│  TITLE 1 (H1)                                                                            │
│  ████████████████████████████████████████                                               │
│  48px / 700 weight                                                                       │
│                                                                                          │
│  TITLE 2 (H2)                                                                            │
│  ████████████████████████████████                                                       │
│  36px / 600 weight                                                                       │
│                                                                                          │
│  TITLE 3 (H3)                                                                            │
│  ██████████████████████████                                                             │
│  24px / 600 weight                                                                       │
│                                                                                          │
│  TITLE 4 (H4)                                                                            │
│  ██████████████████████                                                                 │
│  20px / 500 weight                                                                       │
│                                                                                          │
│  Body 1                                                                                  │
│  ████████████████████                                                                   │
│  16px / 400 weight                                                                       │
│                                                                                          │
│  Body 2                                                                                  │
│  ████████████████                                                                       │
│  14px / 400 weight                                                                       │
│                                                                                          │
│  Caption                                                                                 │
│  ██████████████                                                                         │
│  12px / 400 weight                                                                       │
│                                                                                          │
│  OVERLINE                                                                                │
│  ████████████                                                                           │
│  10px / 500 weight / uppercase / 1px tracking                                           │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Display Typography

### Display 1

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                          │
│                                                                                          │
│     JUST DO IT                                                                           │
│                                                                                          │
│     Font: Helvetica Neue                                                                 │
│     Size: 84px (desktop) → 44px (mobile)                                                │
│     Weight: 800 (Extra Bold)                                                             │
│     Line Height: 1.0                                                                     │
│     Letter Spacing: -2px                                                                 │
│     Transform: uppercase (optional)                                                      │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### Display 2

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                          │
│     The Future of Air                                                                    │
│                                                                                          │
│     Font: Helvetica Neue                                                                 │
│     Size: 64px (desktop) → 36px (mobile)                                                │
│     Weight: 800 (Extra Bold)                                                             │
│     Line Height: 1.0                                                                     │
│     Letter Spacing: -1px                                                                 │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Title Hierarchy

### Titles 1-4

```
Title 1 (H1)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Men's Running Shoes

Size: 48px → 32px (mobile)
Weight: 700
Line Height: 1.2


Title 2 (H2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Find Your Perfect Fit

Size: 36px → 28px (mobile)
Weight: 600
Line Height: 1.2


Title 3 (H3)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Shop by Category

Size: 24px → 22px (mobile)
Weight: 600
Line Height: 1.3


Title 4 (H4)
━━━━━━━━━━━━━━━━━━━━━━━━━━
Product Features

Size: 20px → 18px (mobile)
Weight: 500
Line Height: 1.4
```

## Body Text

### Body Variants

```
Body 1 (Default)
──────────────────────────────────────────────────────────────────────────────
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
veniam, quis nostrud exercitation ullamco laboris.

Size: 16px
Weight: 400
Line Height: 1.6
Max Width: 65ch (recommended)


Body 1 Strong
──────────────────────────────────────────────────────────────────────────────
Lorem ipsum dolor sit amet, consectetur adipiscing elit.

Size: 16px
Weight: 500
Line Height: 1.6


Body 2 (Secondary)
────────────────────────────────────────────────────────────────
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt.

Size: 14px
Weight: 400
Line Height: 1.5


Body 3 / Caption
──────────────────────────────────────────────────────
Small text for captions and supplementary information.

Size: 12px
Weight: 400
Line Height: 1.5
```

## Utility Styles

### Overline

```
┌──────────────────────────────────────────┐
│                                          │
│  FEATURED PRODUCT                        │
│                                          │
│  Size: 10px                              │
│  Weight: 500                             │
│  Transform: uppercase                    │
│  Letter Spacing: 1px                     │
│                                          │
└──────────────────────────────────────────┘
```

### Link Styles

```
Inline Link
──────────────────────────────────────────
Learn more about our ⟨sustainability⟩ efforts.
                     └── underlined, hover: darker

Size: inherits from parent
Weight: 500
Color: #111111
Decoration: underline
Underline Offset: 2px
```

### Price Styles

```
┌──────────────────────────────────────────┐
│                                          │
│  $150                                    │  Regular Price
│  Size: 16px, Weight: 500                 │
│                                          │
│  $119  $160                              │  Sale Price
│   ↑     ↑                                │
│  Sale  Original (strikethrough)          │
│  #9E3500  #757575                        │
│                                          │
└──────────────────────────────────────────┘
```

## Color Variants

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                          │
│  Primary Text                                                                            │
│  ████████████████████████████████                     Color: #111111                    │
│                                                                                          │
│  Secondary Text                                                                          │
│  ████████████████████████████████                     Color: #757575                    │
│                                                                                          │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  Inverse Text (on dark)                                                                  │
│  ████████████████████████████████                     Color: #FFFFFF                    │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                                                                          │
│  Sale/Accent Text                                                                        │
│  ████████████████████████████████                     Color: #9E3500                    │
│                                                                                          │
│  Error Text                                                                              │
│  ████████████████████████████████                     Color: #D32F2F                    │
│                                                                                          │
│  Success Text                                                                            │
│  ████████████████████████████████                     Color: #388E3C                    │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Responsive Scaling

```
Desktop (≥1024px)          Tablet (768-1023px)        Mobile (<768px)
───────────────────        ───────────────────        ────────────────

Display 1: 84px            Display 1: 64px            Display 1: 44px
Display 2: 64px            Display 2: 48px            Display 2: 36px
Title 1: 48px              Title 1: 40px              Title 1: 32px
Title 2: 36px              Title 2: 32px              Title 2: 28px
Title 3: 24px              Title 3: 24px              Title 3: 22px
Title 4: 20px              Title 4: 20px              Title 4: 18px
Body 1: 16px               Body 1: 16px               Body 1: 16px
Body 2: 14px               Body 2: 14px               Body 2: 14px
Caption: 12px              Caption: 12px              Caption: 12px
```

## Line Length Guidelines

```
Optimal Reading:

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                          │
│  ├──────────────────────── 45-75 characters ────────────────────────────────────────────┤
│                                                                                          │
│  Lorem ipsum dolor sit amet, consectetur adipiscing elit.                               │
│  Sed do eiusmod tempor incididunt ut labore et dolore                                   │
│  magna aliqua. Ut enim ad minim veniam, quis nostrud                                    │
│  exercitation ullamco laboris nisi ut aliquip ex ea                                     │
│  commodo consequat.                                                                      │
│                                                                                          │
│  Recommended: max-width: 65ch                                                            │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```
