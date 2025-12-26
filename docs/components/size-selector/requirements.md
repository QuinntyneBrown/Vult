# Size Selector Component

## Overview
A grid of size option buttons used in filters to allow users to filter products by size. Each button represents a size option (numeric or text) and can be selected to filter the product listing.

## Requirements

### Functional Requirements

1. **Size Display**
   - Grid of size buttons
   - Numeric sizes (7, 7.5, 8, etc.)
   - Text sizes (XS, S, M, L, XL)
   - Support for half sizes

2. **Selection**
   - Click to toggle selection
   - Multiple selection support
   - Visual indication of selected state
   - Deselect on second click

3. **Availability**
   - Show unavailable sizes (grayed out)
   - Unavailable sizes still clickable (for notifications)

4. **Layout**
   - 3-column grid in sidebar
   - Responsive sizing
   - Consistent button dimensions

### Non-Functional Requirements

1. **Performance**
   - CSS-only styling
   - No images required

2. **Accessibility**
   - Keyboard navigable
   - Screen reader announces size
   - Visible focus states
   - 44x44px minimum touch target

## Acceptance Criteria

### AC1: Size Display
- **Given** a size filter section
- **When** it renders
- **Then** size buttons appear in a grid
- **And** each shows its size value

### AC2: Selection
- **Given** a size button
- **When** the user clicks it
- **Then** a selection border appears
- **And** the filter applies

### AC3: Multiple Selection
- **Given** one size selected
- **When** user clicks another size
- **Then** both sizes are selected
- **And** filter shows products in either size

### AC4: Unavailable Size
- **Given** a size with no products
- **When** the grid renders
- **Then** the size appears grayed out
- **And** it can still be clicked

### AC5: Keyboard Navigation
- **Given** focus on size buttons
- **When** user presses arrow keys
- **Then** focus moves between buttons
- **And** Enter/Space toggles selection

## Dependencies
- Filter sidebar component
- Product size filtering API
