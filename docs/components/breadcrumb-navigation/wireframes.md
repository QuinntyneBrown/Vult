# Breadcrumb Navigation Wireframes

## Standard Breadcrumb

### Desktop Layout

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  ├─48px─┤                                                                  │
│                                                                            │
│  Home  /  Men  /  Shoes  /  Running                                        │
│  ─────    ───    ─────    ━━━━━━━                                          │
│  ▲        ▲      ▲        ▲                                                │
│  Link     Link   Link     Current (no link, bold)                          │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

Font size: 14px
Line height: 1.5
Link color: #757575
Current color: #111111
Separator: "/" with 8px margin each side
```

### Short Breadcrumb (2 levels)

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  Home  /  Men's New Releases                                               │
│  ─────    ━━━━━━━━━━━━━━━━━━                                               │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Long Breadcrumb (Many levels)

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  Home  /  Men  /  Shoes  /  Running  /  Road Running  /  Pegasus 40        │
│  ─────    ───    ─────    ───────    ────────────    ━━━━━━━━━━━━━━━━━    │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

## Mobile Layout

### Mobile Truncated (Default)

```
┌────────────────────────────────────────┐
│                                        │
│  ├─16px─┤                              │
│                                        │
│  Home  /  ...  /  Running              │
│  ─────    ───    ━━━━━━━               │
│                                        │
│  Middle items collapsed                │
│                                        │
└────────────────────────────────────────┘

Font size: 12px
Shows: First level + ... + Current
```

### Mobile Expanded

```
┌────────────────────────────────────────┐
│                                        │
│  Home  /  Men  /  Shoes  /  Running    │
│  ─────    ───    ─────    ━━━━━━━      │
│                                        │
│  Wraps to multiple lines if needed     │
│                                        │
└────────────────────────────────────────┘
```

## With Back Arrow (Mobile Alternative)

```
┌────────────────────────────────────────┐
│                                        │
│  ← Back to Shoes                       │
│                                        │
└────────────────────────────────────────┘

Alternative mobile pattern
Shows previous level only
```

## States

### Hover State

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  Home  /  Men  /  Shoes  /  Running                                        │
│         ━━━                                                                │
│         ▲                                                                  │
│         Underline on hover, color: #111111                                 │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Focus State

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  Home  /  [Men]  /  Shoes  /  Running                                      │
│         ├─────┤                                                            │
│         Focus outline: 2px solid #111111                                   │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

## Spacing Details

```
Breadcrumb Structure:

┌────────────────────────────────────────────────────────────────────────────┐
│ ├─48px (desktop) / 16px (mobile)─┤                                         │
│ ▲                                                                          │
│ 12px padding-top                                                           │
│ ▼                                                                          │
│                                                                            │
│  Home ├─8px─┤ / ├─8px─┤ Men ├─8px─┤ / ├─8px─┤ Current                     │
│  ▲                                                                         │
│  │ 14px font (desktop) / 12px (mobile)                                     │
│                                                                            │
│ ▲                                                                          │
│ 12px padding-bottom                                                        │
│ ▼                                                                          │
└────────────────────────────────────────────────────────────────────────────┘

Typography:
- Links: 14px, 400 weight, #757575
- Current: 14px, 400 weight, #111111
- Separator: 14px, 400 weight, #757575
- Hover: underline, #111111
```

## Page Context

### Breadcrumb in Page Layout

```
┌────────────────────────────────────────────────────────────────────────────┐
│                          [Navigation Bar]                                  │
├────────────────────────────────────────────────────────────────────────────┤
│  Home  /  Men  /  Shoes  /  New Releases                                   │ ← Breadcrumb
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                          Men's New Releases                                │ ← Page Header
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                          [Filters & Content]                               │
└────────────────────────────────────────────────────────────────────────────┘
```
