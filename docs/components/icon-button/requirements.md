# Icon Button Component

## Overview
The icon button is a compact, circular button containing only an icon without text labels. Used for actions where the icon is universally understood (e.g., close, search, favorite, shopping bag) or where space is limited. Common uses include navigation controls, quick actions, and toolbar functions.

## Requirements

### Functional Requirements

1. **Icon Display**
   - Display single icon centered in button
   - Support for SVG icons
   - Consistent icon sizing
   - Icon inherits button color

2. **Click/Tap Action**
   - Execute assigned action on click/tap
   - Support toggle states (favorite on/off)
   - Prevent double-click actions

3. **Size Variants**
   - Small (32px) - compact spaces
   - Medium (40px) - default
   - Large (48px) - primary actions

4. **Style Variants**
   - Filled (solid background)
   - Outlined (border only)
   - Ghost (transparent)

5. **States**
   - Default
   - Hover
   - Active/Pressed
   - Focus
   - Disabled
   - Toggle on/off

### Non-Functional Requirements

1. **Accessibility**
   - MUST have ARIA label describing action
   - Minimum 44x44px touch target
   - Visible focus indicators
   - Color contrast requirements met

2. **Performance**
   - No layout shift on state change
   - Smooth transitions (60fps)

## Acceptance Criteria

### AC1: Icon Display
- **Given** an icon button renders
- **When** in its default state
- **Then** the icon is centered within a circular button
- **And** the icon size is proportional to button size

### AC2: ARIA Label Required
- **Given** an icon button
- **When** it renders without aria-label
- **Then** an accessibility warning should be logged
- **And** screen readers should announce the action

### AC3: Hover State
- **Given** an icon button
- **When** the user hovers over it
- **Then** the background changes to indicate interactivity
- **And** the transition is smooth (200ms)

### AC4: Toggle State
- **Given** a toggleable icon button (e.g., favorite)
- **When** the user clicks it
- **Then** the icon changes to indicate the new state
- **And** the state persists until toggled again

### AC5: Touch Target
- **Given** a small (32px) icon button
- **When** on a touch device
- **Then** the touch target is still at least 44x44px
- **And** visual button remains at specified size

### AC6: Disabled State
- **Given** a disabled icon button
- **When** it renders
- **Then** the icon and background are muted
- **And** click events are prevented
- **And** cursor shows "not-allowed"

### AC7: Focus State
- **Given** keyboard navigation
- **When** the button receives focus
- **Then** a visible focus ring appears
- **And** the ring follows the circular shape

## Dependencies
- Icon library/SVG icons
- ARIA label content
