# Primary Button Wireframes

## Size Variants

### Small Button

```
┌───────────────────────┐
│                       │
│        Shop           │  Height: 36px
│                       │  Padding: 8px 20px
│                       │  Font: 14px
└───────────────────────┘
```

### Medium Button (Default)

```
┌─────────────────────────────┐
│                             │
│         Shop Now            │  Height: 44px
│                             │  Padding: 12px 24px
│                             │  Font: 16px
└─────────────────────────────┘
```

### Large Button

```
┌─────────────────────────────────────┐
│                                     │
│           Add to Bag                │  Height: 52px
│                                     │  Padding: 16px 32px
│                                     │  Font: 16px
└─────────────────────────────────────┘
```

## Width Variants

### Auto Width

```
┌───────────────────────┐
│       Shop Now        │  Width based on content
└───────────────────────┘
```

### Full Width

```
┌─────────────────────────────────────────────────────────────────────┐
│                              Add to Bag                              │
└─────────────────────────────────────────────────────────────────────┘

Width: 100% of container
```

## Interactive States

### Default State

```
┌─────────────────────────────┐
│                             │
│  ███████████████████████████│  Background: #111111
│  ███    Shop Now    ███████ │  Text: #FFFFFF
│  ███████████████████████████│  Border-radius: 30px
│                             │
└─────────────────────────────┘
```

### Hover State

```
┌─────────────────────────────┐
│                             │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  Background: #333333
│  ▓▓▓    Shop Now    ▓▓▓▓▓▓▓ │  Slightly lighter
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│                             │
└─────────────────────────────┘
```

### Active/Pressed State

```
       ↓ Slightly scaled down (0.95)
       │
┌──────▼──────────────────┐
│                         │
│  ██████████████████████ │  Background: #111111
│  ███   Shop Now   █████ │  Scale: 0.95
│  ██████████████████████ │
│                         │
└─────────────────────────┘
```

### Focus State

```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
  ┌─────────────────────────┐   ← 2px focus ring, 2px offset
│ │                         │ │
  │  ███    Shop Now    ███ │
│ │                         │ │
  └─────────────────────────┘
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

### Disabled State

```
┌─────────────────────────────┐
│                             │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░│  Background: #CCCCCC
│  ░░░    Shop Now    ░░░░░░░ │  Text: #767676
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░│  Cursor: not-allowed
│                             │
└─────────────────────────────┘
```

### Loading State

```
┌─────────────────────────────┐
│                             │
│  ███████████████████████████│
│  ████    ⟳        █████████ │  Spinning loader
│  ███████████████████████████│  Same width as text state
│                             │
└─────────────────────────────┘
```

## Button Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  ├─ padding-left ─┤  Button Text  ├─ padding-right ─┤      │
│                                                              │
│  ▲                                                       ▲   │
│  │                                                       │   │
│  padding-top                                    padding-bottom
│  │                                                       │   │
│  ▼                                                       ▼   │
└─────────────────────────────────────────────────────────────┘

Border-radius: pill shape (height / 2) or fixed 30px
```

## With Icon Variants

### Text + Right Icon

```
┌─────────────────────────────────────┐
│                                     │
│      Shop Now    →                  │  Icon: 18x18px
│                                     │  Gap: 8px between text and icon
└─────────────────────────────────────┘
```

### Text + Left Icon

```
┌─────────────────────────────────────┐
│                                     │
│      ❤   Add to Favorites           │  Icon: 18x18px
│                                     │  Gap: 8px between icon and text
└─────────────────────────────────────┘
```

## Touch Target Visualization

```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│                               │
│  ┌─────────────────────────┐  │  ← 44px minimum touch target
│  │                         │  │
│  │       Shop Now          │  │
│  │                         │  │
│  └─────────────────────────┘  │
│                               │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘

Even if visual button is smaller, touch target should be 44x44px minimum
```

## Color Variants

### Dark on Light Background (Default)

```
Background: #FFFFFF (page)

┌─────────────────────────────┐
│  ███████████████████████████│  Button bg: #111111
│  ███    Shop Now    ███████ │  Button text: #FFFFFF
│  ███████████████████████████│
└─────────────────────────────┘
```

### Light on Dark Background (Inverse)

```
Background: #111111 (page)

┌─────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░│  Button bg: #FFFFFF
│  ░░░    Shop Now    ░░░░░░░ │  Button text: #111111
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░│
└─────────────────────────────┘
```
