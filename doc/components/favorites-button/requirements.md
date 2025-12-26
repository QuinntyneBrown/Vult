# Favorites Button Component

## Overview
The Favorites Button (also known as Wishlist button) allows users to save products to their favorites/wishlist for later. It features a heart icon that toggles between filled and outlined states based on whether the product is in the user's favorites.

## Requirements

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | Display heart icon for favorite action | High |
| FR-002 | Toggle between favorited and not-favorited states | High |
| FR-003 | Show loading state during API call | Medium |
| FR-004 | Emit event on toggle | High |
| FR-005 | Support both icon-only and icon-with-text variants | Medium |
| FR-006 | Support keyboard activation | High |
| FR-007 | Show tooltip on hover (icon-only variant) | Low |
| FR-008 | Animate heart icon on toggle | Medium |

### Non-Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-001 | Touch target minimum 44x44px | High |
| NFR-002 | WCAG 2.1 AA accessible | High |
| NFR-003 | Heart animation smooth and delightful | Medium |
| NFR-004 | Support reduced motion preferences | Medium |

## Acceptance Criteria

### AC-001: Default Display (Not Favorited)
**Given** a product not in the user's favorites
**When** the component renders
**Then** an outlined heart icon should be displayed
**And** the aria-pressed attribute should be "false"

### AC-002: Favorited Display
**Given** a product in the user's favorites
**When** the component renders
**Then** a filled heart icon should be displayed
**And** the aria-pressed attribute should be "true"

### AC-003: Toggle Action
**Given** the favorites button is clicked
**When** the click event fires
**Then** the button should show loading state briefly
**And** toggle to the opposite state
**And** emit a toggle event with the new state

### AC-004: Animation
**Given** the user toggles the favorite state
**When** the icon changes
**Then** a subtle scale animation should occur
**And** the animation should respect reduced-motion preferences

### AC-005: Full Width Variant
**Given** the full-width variant is used
**When** the component renders
**Then** the button should span full width
**And** display "Favorite" text next to the icon

## Technical Specifications

### Component API

```typescript
interface FavoritesButtonInputs {
  isFavorited: boolean;
  loading?: boolean;
  variant?: 'icon-only' | 'full-width';
  showText?: boolean;
  ariaLabel?: string;
  tooltipText?: string;
}

interface FavoritesButtonOutputs {
  favoriteToggle: EventEmitter<boolean>;
}
```

### Events
- `favoriteToggle`: Emitted when favorite state is toggled, with new state

## Dependencies
- None (standalone component)

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
