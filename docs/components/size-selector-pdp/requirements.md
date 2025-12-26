# Size Selector PDP Component

## Overview
The Size Selector PDP (Product Detail Page) component allows users to select a product size. It displays available sizes in a grid layout with clear visual states for available, unavailable, and selected sizes. This is specifically designed for the product detail page context.

## Requirements

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | Display all available sizes in a grid | High |
| FR-002 | Allow single size selection | High |
| FR-003 | Show visual indication for unavailable sizes | High |
| FR-004 | Show visual indication for selected size | High |
| FR-005 | Display "Size Guide" link | Medium |
| FR-006 | Show size availability status | Medium |
| FR-007 | Support keyboard navigation | High |
| FR-008 | Emit selection event on size click | High |
| FR-009 | Display "Select Size" header with hint | Medium |
| FR-010 | Show error state when adding to bag without size | High |

### Non-Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-001 | Touch targets must be at least 44x44px | High |
| NFR-002 | Must be accessible (WCAG 2.1 AA) | High |
| NFR-003 | Smooth hover/focus transitions | Medium |
| NFR-004 | Support international size formats | Low |

## Acceptance Criteria

### AC-001: Size Grid Display
**Given** a product with available sizes
**When** the component renders
**Then** all sizes should be displayed in a 5-column grid layout
**And** each size button should be 48px tall

### AC-002: Size Selection
**Given** the size grid is displayed
**When** the user clicks on an available size
**Then** the size should be visually selected with a border highlight
**And** a selection event should be emitted

### AC-003: Unavailable Size
**Given** a size is marked as unavailable
**When** the component renders
**Then** the size should be displayed with reduced opacity
**And** clicking should not select the size
**And** a diagonal line should cross through the size

### AC-004: Error State
**Given** no size is selected
**When** the user attempts to add to bag
**Then** the size selector should show an error state
**And** an error message should be displayed

### AC-005: Size Guide Link
**Given** the size selector is displayed
**When** the component renders
**Then** a "Size Guide" link should be displayed above the grid
**And** clicking should open the size guide modal

## Technical Specifications

### Component API

```typescript
interface SizeOption {
  id: string;
  label: string;
  available: boolean;
  lowStock?: boolean;
}

interface SizeSelectorPdpInputs {
  sizes: SizeOption[];
  selectedSizeId?: string;
  showSizeGuide?: boolean;
  errorMessage?: string;
  headerLabel?: string;
  ariaLabel?: string;
}

interface SizeSelectorPdpOutputs {
  sizeSelect: EventEmitter<SizeOption>;
  sizeGuideClick: EventEmitter<void>;
}
```

### Events
- `sizeSelect`: Emitted when a size is selected
- `sizeGuideClick`: Emitted when size guide link is clicked

## Dependencies
- None (standalone component)

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
