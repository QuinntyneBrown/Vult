# Primary Button Component

## Overview
The primary button is the main call-to-action element used throughout the website. It features a solid fill design with high visual prominence, used for the most important actions on a page such as "Add to Bag", "Shop Now", or "Join".

## Requirements

### Functional Requirements

1. **Click/Tap Action**
   - Execute assigned action on click/tap
   - Support for links (navigation)
   - Support for button actions (form submit, events)
   - Prevent double-click/rapid-fire actions

2. **Loading State**
   - Display loading spinner during async operations
   - Disable interaction during loading
   - Maintain button width during loading

3. **Disabled State**
   - Visually indicate non-interactive state
   - Prevent click/tap actions
   - Reduce opacity or use muted colors

4. **Size Variants**
   - Small (compact areas, secondary actions)
   - Medium (default, most use cases)
   - Large (hero sections, primary CTAs)

5. **Width Variants**
   - Auto width (content-based)
   - Full width (span container)

### Non-Functional Requirements

1. **Accessibility**
   - Minimum 44x44px touch target
   - Visible focus indicators
   - ARIA labels for icon-only buttons
   - Color contrast ratio ≥ 4.5:1

2. **Performance**
   - No layout shift on state change
   - Smooth transitions (60fps)
   - Minimal CSS footprint

3. **Browser Support**
   - All modern browsers
   - Graceful degradation for older browsers

## Acceptance Criteria

### AC1: Default Appearance
- **Given** a primary button renders
- **When** in its default state
- **Then** it displays with dark background (#111111)
- **And** white text (#FFFFFF)
- **And** rounded corners (30px border-radius)

### AC2: Hover State
- **Given** a primary button in default state
- **When** the user hovers over it (desktop)
- **Then** the background color lightens (#333333)
- **And** the transition is smooth (200ms)

### AC3: Active/Pressed State
- **Given** a primary button being clicked
- **When** the user presses down
- **Then** the button scales down slightly (0.95)
- **And** returns to normal on release

### AC4: Focus State
- **Given** keyboard navigation
- **When** the button receives focus
- **Then** a visible focus ring appears
- **And** the focus ring has 2px offset from button edge

### AC5: Disabled State
- **Given** a button with disabled attribute
- **When** it renders
- **Then** the background is muted (#CCCCCC)
- **And** the cursor shows "not-allowed"
- **And** click events are prevented

### AC6: Loading State
- **Given** a button in loading state
- **When** it renders
- **Then** a spinner replaces the text
- **And** the button width remains the same
- **And** interactions are disabled

### AC7: Touch Interaction
- **Given** a mobile device
- **When** the user taps the button
- **Then** visual feedback is immediate
- **And** the tap target is at least 44x44px

### AC8: Link Button
- **Given** a button rendered as an anchor tag
- **When** clicked
- **Then** it navigates to the href destination
- **And** maintains all visual styling of a button

## Dependencies
- Loading spinner component (for loading state)
- Icon library (if using icon buttons)
