# Navigation Bar CSS Specification

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--nav-bg` | `#FFFFFF` | Navigation background |
| `--nav-text-primary` | `#111111` | Primary text and icons |
| `--nav-text-secondary` | `#757575` | Secondary/muted text |
| `--nav-hover-bg` | `#E5E5E5` | Icon button hover state |
| `--nav-search-bg` | `#F5F5F5` | Search input background |
| `--nav-search-bg-focus` | `#E5E5E5` | Search input focus state |
| `--nav-badge-bg` | `#111111` | Badge background |
| `--nav-badge-text` | `#FFFFFF` | Badge text color |
| `--nav-shadow` | `rgba(0,0,0,0.05)` | Drop shadow color |
| `--promo-bg` | `#F5F5F5` | Promo banner background |

### Typography

| Element | Font Family | Size | Weight | Line Height | Letter Spacing |
|---------|-------------|------|--------|-------------|----------------|
| Nav Links | Helvetica Neue | 16px | 500 | 1.5 | 0.5px |
| Promo Banner | Helvetica Neue | 11px | 400 | 1.4 | 0.5px |
| Dropdown Header | Helvetica Neue | 16px | 500 | 1.5 | 0 |
| Dropdown Links | Helvetica Neue | 14px | 400 | 1.5 | 0 |
| Badge | Helvetica Neue | 10px | 500 | 1 | 0 |

### Spacing Scale

| Token | Value |
|-------|-------|
| `--space-xs` | 4px |
| `--space-sm` | 8px |
| `--space-md` | 16px |
| `--space-lg` | 24px |
| `--space-xl` | 32px |
| `--space-2xl` | 48px |

## Component Dimensions

### Container

```css
.nav-container {
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: #FFFFFF;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.nav-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 48px;
    max-width: 1920px;
    margin: 0 auto;
}
```

### Logo

```css
.nav-logo svg {
    width: 59px;
    height: 21px;
    fill: #111111;
    transition: fill 0.2s ease;
}

.nav-logo:hover svg {
    fill: #757575;
}
```

### Navigation Links

```css
.nav-primary {
    display: flex;
    align-items: center;
    gap: 24px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}

.nav-link {
    font-size: 16px;
    font-weight: 500;
    color: #111111;
    text-decoration: none;
    padding: 20px 0;
    position: relative;
    letter-spacing: 0.5px;
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: 18px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #111111;
    transform: scaleX(0);
    transition: transform 0.2s ease;
}

.nav-link:hover::after {
    transform: scaleX(1);
}
```

### Search Input

```css
.search-container {
    position: relative;
    margin-right: 8px;
}

.search-input {
    width: 180px;
    height: 40px;
    border: none;
    border-radius: 20px;
    background-color: #F5F5F5;
    padding: 0 40px 0 44px;
    font-size: 16px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    transition: width 0.2s ease, background-color 0.2s ease;
}

.search-input:focus {
    width: 280px;
    background-color: #E5E5E5;
    outline: none;
}

.search-input::placeholder {
    color: #757575;
}

.search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    fill: #111111;
    pointer-events: none;
}
```

### Icon Buttons

```css
.icon-btn {
    width: 40px;
    height: 40px;
    border: none;
    background: transparent;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
    position: relative;
}

.icon-btn:hover {
    background-color: #E5E5E5;
}

.icon-btn:focus {
    outline: 2px solid #111111;
    outline-offset: 2px;
}

.icon-btn svg {
    width: 24px;
    height: 24px;
    fill: #111111;
}
```

### Badge

```css
.badge {
    position: absolute;
    top: 4px;
    right: 4px;
    min-width: 18px;
    height: 18px;
    background-color: #111111;
    color: #FFFFFF;
    font-size: 10px;
    font-weight: 500;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px;
}
```

### Promo Banner

```css
.promo-banner {
    background-color: #F5F5F5;
    text-align: center;
    padding: 8px 16px;
    font-size: 11px;
    color: #111111;
}

.promo-banner a {
    color: #111111;
    text-decoration: underline;
    font-weight: 500;
}
```

### Dropdown Menu

```css
.dropdown-menu {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background-color: #FFFFFF;
    padding: 48px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dropdown-content {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 32px;
}

.dropdown-column h4 {
    font-size: 16px;
    font-weight: 500;
    color: #111111;
    margin-bottom: 16px;
}

.dropdown-column a {
    font-size: 14px;
    color: #757575;
    text-decoration: none;
    transition: color 0.2s ease;
}

.dropdown-column a:hover {
    color: #111111;
}
```

## Spacing Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PROMO BANNER                                    │
│  ├─16px─┤                      Content                      ├─16px─┤        │
│  ▲      ▲                                                   ▲      ▲        │
│ 8px   8px                                                  8px   8px        │
└─────────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────┐
│├─48px─┤                                                         ├─48px─┤   │
│                                                                             │
│ LOGO    ├─gap:24px─┤ Link ├─gap:24px─┤ Link │   │Search│├─4px─┤Icon│├─4px─┤│
│ 59x21                                              180x40      40x40        │
│                                                                             │
│ ▲                        NAV HEIGHT = 60px                              ▲   │
│ │                                                                       │   │
│ └───────────────────── centered vertically ─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘

Icon Button Detail:
┌───────────┐
│  40x40px  │
│  ┌─────┐  │
│  │24x24│  │  Icon centered
│  └─────┘  │
│     ┌──┐  │
│     │18│  │  Badge: top: 4px, right: 4px
│     └──┘  │
└───────────┘

Search Input Detail:
┌──────────────────────────────────────┐
│  12px  │ Icon │  8px  │  Input Text  │  Height: 40px
│        │24x24 │       │              │  Border-radius: 20px
│        │      │       │              │  Padding: 0 40px 0 44px
└──────────────────────────────────────┘
```

## Responsive Breakpoints

### Tablet (600px - 959px)

```css
@media (max-width: 960px) {
    .nav-wrapper {
        padding: 0 24px;
    }

    .nav-primary {
        display: none;
    }

    .mobile-menu-btn {
        display: flex;
        order: -1;
        margin-right: 16px;
    }

    .nav-logo {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }

    .search-input {
        width: 40px;
        padding: 0;
        background-color: transparent;
    }

    .search-input:focus {
        width: 200px;
        background-color: #F5F5F5;
        padding: 0 40px 0 44px;
    }
}
```

### Mobile (<600px)

```css
@media (max-width: 600px) {
    .nav-wrapper {
        padding: 0 16px;
    }

    .icon-btn.favorites,
    .icon-btn.account {
        display: none;
    }
}
```

## Animation Specifications

| Property | Duration | Easing | Usage |
|----------|----------|--------|-------|
| Underline transform | 200ms | ease | Nav link hover |
| Search width | 200ms | ease | Search expand/collapse |
| Background color | 200ms | ease | Icon button hover |
| Fill color | 200ms | ease | Logo hover |
| Text color | 200ms | ease | Dropdown link hover |

## Z-Index Stack

| Element | Z-Index |
|---------|---------|
| Nav Container | 100 |
| Dropdown Menu | 99 |
| Mobile Menu Overlay | 150 |
| Mobile Menu Drawer | 151 |
