# Product Card Wireframes

## Standard Product Card

### Desktop (within grid)

```
┌─────────────────────────────────────┐
│                               ♡     │ ← Favorite button (top-right)
│                                     │
│    ┌───────────────────────────┐    │
│    │                           │    │
│    │                           │    │
│    │      PRODUCT IMAGE        │    │
│    │      (3:4 aspect ratio)   │    │
│    │                           │    │
│    │                           │    │
│    │                           │    │
│    │                           │    │
│    └───────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  Nike Air Max 270                   │ ← Product Name (16px, bold)
│  Women's Shoes                      │ ← Category (14px, gray)
│  3 Colors                           │ ← Color count (14px, gray)
│                                     │
│  $150                               │ ← Price (16px, bold)
│                                     │
└─────────────────────────────────────┘

Width: 200-350px (flexible in grid)
Image aspect: 3:4 (or 0.75:1)
Padding: 0 (edge to edge image)
Info padding: 12px
```

### Card with Sale Price

```
┌─────────────────────────────────────┐
│ ┌──────┐                       ♡    │
│ │ SALE │                            │ ← Sale badge (top-left)
│ └──────┘                            │
│    ┌───────────────────────────┐    │
│    │                           │    │
│    │      PRODUCT IMAGE        │    │
│    │                           │    │
│    │                           │    │
│    │                           │    │
│    └───────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  Nike React Infinity Run            │
│  Men's Running Shoe                 │
│  2 Colors                           │
│                                     │
│  $119  ~~$160~~                     │ ← Sale price + strikethrough
│                                     │
└─────────────────────────────────────┘
```

### Card with "Just In" Badge

```
┌─────────────────────────────────────┐
│ ┌─────────┐                    ♡    │
│ │ Just In │                         │
│ └─────────┘                         │
│    ┌───────────────────────────┐    │
│    │                           │    │
│    │      PRODUCT IMAGE        │    │
│    │                           │    │
│    │                           │    │
│    └───────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  Jordan 1 Retro High OG             │
│  Shoes                              │
│  1 Color                            │
│                                     │
│  $180                               │
│                                     │
└─────────────────────────────────────┘
```

## Card States

### Hover State (Desktop)

```
┌─────────────────────────────────────┐
│                               ♡     │
│ ╔═══════════════════════════════╗   │ ← Shadow appears
│ ║                               ║   │
│ ║   SECONDARY IMAGE             ║   │ ← Image swaps to alt angle
│ ║   (on hover)                  ║   │
│ ║                               ║   │
│ ╚═══════════════════════════════╝   │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  Nike Air Max 270                   │
│  Women's Shoes                      │
│  3 Colors                           │
│                                     │
│  $150                               │
│                                     │
└─────────────────────────────────────┘
```

### Favorited State

```
┌─────────────────────────────────────┐
│                               ♥     │ ← Filled heart (red or black)
│                                     │
│    ┌───────────────────────────┐    │
│    │                           │    │
│    │      PRODUCT IMAGE        │    │
│    │                           │    │
│    │                           │    │
│    └───────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  Nike Air Max 270                   │
│  Women's Shoes                      │
│                                     │
│  $150                               │
│                                     │
└─────────────────────────────────────┘
```

### Sold Out State

```
┌─────────────────────────────────────┐
│                               ♡     │
│                                     │
│    ┌───────────────────────────┐    │
│    │ ░░░░░░░░░░░░░░░░░░░░░░░░░ │    │ ← Reduced opacity overlay
│    │ ░░░░░░░░░░░░░░░░░░░░░░░░░ │    │
│    │ ░░░░  SOLD OUT  ░░░░░░░░░ │    │ ← "Sold Out" text
│    │ ░░░░░░░░░░░░░░░░░░░░░░░░░ │    │
│    │ ░░░░░░░░░░░░░░░░░░░░░░░░░ │    │
│    └───────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  Nike Dunk Low                      │
│  Men's Shoes                        │
│  1 Color                            │
│                                     │
│  $110                               │
│                                     │
└─────────────────────────────────────┘
```

## Color Variants Display

### With Color Swatches

```
┌─────────────────────────────────────┐
│                               ♡     │
│    ┌───────────────────────────┐    │
│    │                           │    │
│    │      PRODUCT IMAGE        │    │
│    │                           │    │
│    │                           │    │
│    └───────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  Nike Air Force 1 '07               │
│  Men's Shoes                        │
│                                     │
│  ● ● ● ●  +5                        │ ← Color swatches (4 shown + more)
│                                     │
│  $115                               │
│                                     │
└─────────────────────────────────────┘

Swatch size: 16x16px circles
```

## Grid Layout

### 4-Column Desktop Grid

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│             │ │             │ │             │ │             │
│   CARD 1    │ │   CARD 2    │ │   CARD 3    │ │   CARD 4    │
│             │ │             │ │             │ │             │
│─────────────│ │─────────────│ │─────────────│ │─────────────│
│ Name        │ │ Name        │ │ Name        │ │ Name        │
│ Category    │ │ Category    │ │ Category    │ │ Category    │
│ $XXX        │ │ $XXX        │ │ $XXX        │ │ $XXX        │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
     ├─16px gap─┤
```

### 3-Column Tablet Grid

```
┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
│                   │ │                   │ │                   │
│      CARD 1       │ │      CARD 2       │ │      CARD 3       │
│                   │ │                   │ │                   │
│───────────────────│ │───────────────────│ │───────────────────│
│ Name              │ │ Name              │ │ Name              │
│ Category          │ │ Category          │ │ Category          │
│ $XXX              │ │ $XXX              │ │ $XXX              │
└───────────────────┘ └───────────────────┘ └───────────────────┘
```

### 2-Column Mobile Grid

```
┌─────────────────┐ ┌─────────────────┐
│                 │ │                 │
│     CARD 1      │ │     CARD 2      │
│                 │ │                 │
│─────────────────│ │─────────────────│
│ Name            │ │ Name            │
│ Category        │ │ Category        │
│ $XXX            │ │ $XXX            │
└─────────────────┘ └─────────────────┘
       ├─12px gap─┤
```

## Spacing Details

```
Product Card Detail:

┌─────────────────────────────────────┐
│ ├─0─┤                         ├─0─┤ │  Edge-to-edge image
│                               ┌───┐ │
│                               │ ♡ │ │  Heart: 36x36px touch target
│                               │   │ │  Position: 12px from top/right
│                               └───┘ │
│                                     │
│    ┌───────────────────────────┐    │
│    │                           │    │
│    │     PRODUCT IMAGE         │    │
│    │     aspect-ratio: 3/4     │    │
│    │                           │    │
│    └───────────────────────────┘    │
│                                     │
│ ├─12px─┤                   ├─12px─┤ │
│                                     │
│  Product Name (max 2 lines)         │  ← 16px font, 500 weight
│  ▲                                  │
│  4px                                │
│  ▼                                  │
│  Category                           │  ← 14px font, 400 weight, gray
│  ▲                                  │
│  4px                                │
│  ▼                                  │
│  X Colors                           │  ← 14px font, 400 weight, gray
│  ▲                                  │
│  8px                                │
│  ▼                                  │
│  $XXX                               │  ← 16px font, 500 weight
│  ▲                                  │
│  12px                               │
│  ▼                                  │
└─────────────────────────────────────┘
```
