# Pagination Wireframes

## Standard Pagination

### Desktop

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│                    ◄  1  2  [3]  4  5  ...  12  ►                          │
│                    ▲        ▲                   ▲                          │
│                    │        │                   │                          │
│               Previous   Current             Next                          │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

Button size: 40x40px
Gap: 4px
Current page: bold, underline
```

### With Ellipsis (Many Pages)

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│              ◄  1  ...  5  6  [7]  8  9  ...  24  ►                        │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

Show: First, ellipsis, 2 before current, current, 2 after, ellipsis, last
```

### First/Last Page

```
On page 1:                          On last page:
◄  [1]  2  3  4  5  ...  12  ►      ◄  1  ...  8  9  10  11  [12]  ►
▲                                                                   ▲
│ Disabled                                                    Disabled
```

## Load More Variant

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│                                                                            │
│                    Showing 24 of 234 Products                              │
│                    ──────────────────────────                              │
│                                                                            │
│                    ┌─────────────────────────┐                             │
│                    │      Load More          │                             │
│                    └─────────────────────────┘                             │
│                                                                            │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

Button: 200px width, centered
Progress: Above button
```

## Mobile Pagination

```
┌────────────────────────────────────────┐
│                                        │
│           ◄  Page 3 of 12  ►           │
│                                        │
└────────────────────────────────────────┘

Simplified: Just prev/next with page info
```

## Button States

### Default
```
┌────┐
│  2 │  Border: none
│    │  Background: transparent
└────┘  Text: #111111
```

### Current Page
```
┌────┐
│ [3]│  Font-weight: 500
│    │  Text-decoration: underline
└────┘  Text: #111111
```

### Hover
```
┌────┐
│  4 │  Background: #F5F5F5
│    │
└────┘
```

### Disabled
```
┌────┐
│  ◄ │  Color: #CCCCCC
│    │  Cursor: not-allowed
└────┘
```

## Spacing Details

```
Pagination Layout:

┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  display: flex                                                 │
│  justify-content: center                                       │
│  align-items: center                                           │
│  gap: 4px                                                      │
│                                                                │
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐       │
│  │ ◄  │  │ 1  │  │ 2  │  │[3] │  │ 4  │  │ 5  │  │ ►  │       │
│  └────┘  └────┘  └────┘  └────┘  └────┘  └────┘  └────┘       │
│  ├40px┤  ├────4px gap────┤                       ├40px┤       │
│                                                                │
└────────────────────────────────────────────────────────────────┘

Button: 40x40px
Gap: 4px
Font: 14px
Arrows: 20x20px icon, centered in 40x40px button
```

## Load More Progress

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│               Showing 24 of 234 Products                       │
│               ├───────────┤                                    │
│               Font: 14px, #757575                              │
│                                                                │
│               ├────────────16px gap────────────┤               │
│                                                                │
│               ┌────────────────────────────────┐               │
│               │          Load More             │               │
│               └────────────────────────────────┘               │
│               ├──────────200px─────────────────┤               │
│               Height: 48px                                     │
│               Border: 1.5px solid #111111                      │
│               Border-radius: 24px                              │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```
