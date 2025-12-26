# Checkbox Filter Component

## Overview
A labeled checkbox input used within filter sidebars to allow users to select multiple filter options. Used for category, brand, and other multi-select filters.

## Requirements

### Functional Requirements

1. **Checkbox Input**
   - Standard checkbox behavior
   - Toggle on/off state
   - Support for indeterminate state (optional)

2. **Label**
   - Clickable label text
   - Associated with checkbox for accessibility
   - Optional count indicator

3. **States**
   - Unchecked (default)
   - Checked
   - Hover
   - Focus
   - Disabled

4. **Interaction**
   - Click anywhere on row to toggle
   - Keyboard space/enter to toggle
   - Immediate filter application

### Non-Functional Requirements

1. **Performance**
   - CSS-only checkbox styling
   - Lightweight rendering

2. **Accessibility**
   - Native checkbox input
   - Visible focus state
   - Screen reader support
   - 44x44px minimum touch target

## Acceptance Criteria

### AC1: Toggle State
- **Given** an unchecked checkbox
- **When** the user clicks it
- **Then** the checkbox becomes checked
- **And** a checkmark appears

### AC2: Label Click
- **Given** a checkbox with label
- **When** the user clicks the label
- **Then** the checkbox toggles state

### AC3: Keyboard Toggle
- **Given** focus on a checkbox
- **When** the user presses Space
- **Then** the checkbox toggles state

### AC4: Visual Feedback
- **Given** a checkbox
- **When** the user hovers
- **Then** appropriate hover styling appears

### AC5: Focus State
- **Given** keyboard navigation
- **When** checkbox receives focus
- **Then** a visible focus ring appears

## Dependencies
- Filter sidebar component
