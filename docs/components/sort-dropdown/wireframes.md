# Sort Dropdown Wireframes

## Closed State

### Desktop

```
┌─────────────────────────────────┐
│                                 │
│  Sort By: Featured          ▼  │
│                                 │
└─────────────────────────────────┘

Width: 200px
Height: 40px
Padding: 0 16px
```

### In Toolbar Context

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  234 Results                                           Sort By: Featured ▼ │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

Left: Result count
Right: Sort dropdown
```

## Open State

```
┌─────────────────────────────────┐
│                                 │
│  Sort By: Featured          ▲  │ ← Chevron rotates
│                                 │
├─────────────────────────────────┤
│                                 │
│  ✓ Featured                     │ ← Selected (checkmark)
│                                 │
│    Newest                       │
│                                 │
│    Price: High-Low              │
│                                 │
│    Price: Low-High              │
│                                 │
│    Best Selling                 │
│                                 │
└─────────────────────────────────┘

Dropdown shadow: 0 4px 16px rgba(0,0,0,0.1)
Option height: 40px
```

## Hover State

```
┌─────────────────────────────────┐
│                                 │
│  Sort By: Featured          ▲  │
│                                 │
├─────────────────────────────────┤
│                                 │
│  ✓ Featured                     │
│                                 │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ ← Hover: #F5F5F5 background
│ ░  Newest                    ░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│                                 │
│    Price: High-Low              │
│                                 │
│    Price: Low-High              │
│                                 │
│    Best Selling                 │
│                                 │
└─────────────────────────────────┘
```

## Focus State (Keyboard)

```
┌─────────────────────────────────┐
│                                 │
│  Sort By: Featured          ▲  │
│                                 │
├─────────────────────────────────┤
│                                 │
│  ✓ Featured                     │
│                                 │
│ ┌─────────────────────────────┐ │ ← Focus outline
│ │   Newest                    │ │
│ └─────────────────────────────┘ │
│                                 │
│    Price: High-Low              │
│                                 │
│    Price: Low-High              │
│                                 │
│    Best Selling                 │
│                                 │
└─────────────────────────────────┘

Focus: 2px solid #111111 outline
```

## Mobile Layout

### Mobile Trigger

```
┌────────────────────────────────────────┐
│                                        │
│  ├─16px─┤                   ├─16px─┤   │
│                                        │
│  Sort By: Featured                  ▼  │
│                                        │
└────────────────────────────────────────┘

Full width minus padding
Height: 48px (larger touch target)
```

### Mobile Dropdown

```
┌────────────────────────────────────────┐
│                                        │
│  Sort By: Featured                  ▲  │
│                                        │
├────────────────────────────────────────┤
│                                        │
│  ✓ Featured                            │
│                                        │
├────────────────────────────────────────┤
│                                        │
│    Newest                              │
│                                        │
├────────────────────────────────────────┤
│                                        │
│    Price: High-Low                     │
│                                        │
├────────────────────────────────────────┤
│                                        │
│    Price: Low-High                     │
│                                        │
├────────────────────────────────────────┤
│                                        │
│    Best Selling                        │
│                                        │
└────────────────────────────────────────┘

Full width dropdown
Option height: 48px
Separators between options
```

## Spacing Details

```
Sort Dropdown Structure:

Trigger:
┌─────────────────────────────────┐
│ ├─16px─┤                ├─16px─┤│
│ ▲                               │
│ │ 12px padding                  │
│ ▼                               │
│ Sort By: Featured          ▼   │ ← 14px font
│ ├─────────┤ ├──────────────┤   │
│  Label (gray)  Value (black)    │
│ ▲                               │
│ │ 12px padding                  │
│ ▼                               │
└─────────────────────────────────┘

Height: 40px (desktop) / 48px (mobile)

Options:
┌─────────────────────────────────┐
│ ├─16px─┤                ├─16px─┤│
│ ▲                               │
│ 12px                            │
│ ▼                               │
│ ✓ ├─12px─┤ Option Text         │
│ ▲                               │
│ 12px                            │
│ ▼                               │
└─────────────────────────────────┘

Checkmark: 16x16px
Option height: 40px
```

## Trigger Button States

### Default
```
┌─────────────────────────────────┐
│  Sort By: Featured          ▼  │
└─────────────────────────────────┘
Border: 1px solid #E5E5E5
Background: #FFFFFF
```

### Hover
```
┌─────────────────────────────────┐
│  Sort By: Featured          ▼  │
└─────────────────────────────────┘
Border: 1px solid #111111
Background: #FFFFFF
```

### Active/Open
```
┌─────────────────────────────────┐
│  Sort By: Featured          ▲  │
└─────────────────────────────────┘
Border: 1px solid #111111
Chevron: rotated 180deg
```

### Focus
```
┌═════════════════════════════════┐
│  Sort By: Featured          ▼  │
└═════════════════════════════════┘
Outline: 2px solid #111111
Outline-offset: 2px
```
