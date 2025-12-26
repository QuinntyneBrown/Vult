# Product Info Section Component

## Overview
The Product Info Section displays essential product information including the product title, subtitle, price, and promotional badges. This component serves as the primary informational header for the Product Detail Page (PDP).

## Requirements

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | Display product title prominently | High |
| FR-002 | Display product subtitle/category | High |
| FR-003 | Display current price | High |
| FR-004 | Display original price with strikethrough when on sale | High |
| FR-005 | Display sale percentage badge | Medium |
| FR-006 | Display promotional messages (e.g., "Member Price") | Medium |
| FR-007 | Support multiple currency formats | Medium |
| FR-008 | Display color name for selected variant | High |

### Non-Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-001 | Text must be readable and accessible | High |
| NFR-002 | Support RTL languages | Medium |
| NFR-003 | Responsive typography scaling | High |

## Acceptance Criteria

### AC-001: Title Display
**Given** a product with a title
**When** the component renders
**Then** the title should be displayed in the primary heading style
**And** the title should be wrapped in an appropriate heading element (h1)

### AC-002: Price Display - Regular
**Given** a product with a regular price
**When** the component renders
**Then** the price should be displayed in the standard price format
**And** the currency symbol should be appropriate for the locale

### AC-003: Price Display - Sale
**Given** a product with a sale price
**When** the component renders
**Then** the original price should be displayed with strikethrough
**And** the sale price should be displayed prominently
**And** a sale badge should indicate the discount percentage

### AC-004: Color Selection Display
**Given** a product with multiple color variants
**When** the user selects a color
**Then** the color name should be displayed below the title

## Technical Specifications

### Component API

```typescript
interface ProductPrice {
  current: number;
  original?: number;
  currency: string;
  currencySymbol: string;
  salePercentage?: number;
}

interface ProductInfoSectionInputs {
  title: string;
  subtitle?: string;
  price: ProductPrice;
  colorName?: string;
  promotionalMessage?: string;
  isMemberExclusive?: boolean;
}
```

### Events
- None (display only component)

## Dependencies
- Badge Component (for sale/promotional badges)

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
