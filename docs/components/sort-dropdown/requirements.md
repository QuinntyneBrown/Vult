# Sort Dropdown Component

## Overview
A dropdown select component that allows users to sort product listings by various criteria such as newest, price, and featured items. Appears in the toolbar area above product grids.

## Requirements

### Functional Requirements

1. **Sort Options**
   - Featured (default)
   - Newest
   - Price: High-Low
   - Price: Low-High
   - Best Selling

2. **Dropdown Behavior**
   - Click to open options list
   - Click outside closes dropdown
   - Escape key closes dropdown
   - Single selection only

3. **Selection Feedback**
   - Selected option displayed in trigger
   - Checkmark or highlight on selected option
   - Immediate update of product grid

4. **Trigger Display**
   - "Sort By:" label
   - Current selection value
   - Chevron indicator

### Non-Functional Requirements

1. **Performance**
   - Instant dropdown open/close
   - Debounced sort API calls
   - No flickering during transitions

2. **Accessibility**
   - Listbox role with options
   - Keyboard navigation (arrows, enter, space)
   - Focus management
   - Screen reader announces changes

3. **Responsive**
   - Full-width on mobile
   - Fixed width on desktop
   - Touch-friendly tap targets

## Acceptance Criteria

### AC1: Dropdown Open
- **Given** a closed sort dropdown
- **When** the user clicks the trigger
- **Then** the options list opens below
- **And** the chevron rotates to indicate open state

### AC2: Option Selection
- **Given** an open sort dropdown
- **When** the user clicks an option
- **Then** that option becomes selected
- **And** the dropdown closes
- **And** the products re-sort

### AC3: Keyboard Navigation
- **Given** focus on the dropdown
- **When** the user presses Down Arrow
- **Then** the dropdown opens
- **And** the first option receives focus

### AC4: Close on Outside Click
- **Given** an open sort dropdown
- **When** the user clicks outside the dropdown
- **Then** the dropdown closes
- **And** selection remains unchanged

### AC5: Escape to Close
- **Given** an open sort dropdown
- **When** the user presses Escape
- **Then** the dropdown closes
- **And** focus returns to trigger

### AC6: Screen Reader
- **Given** a sort dropdown
- **When** a screen reader reads the component
- **Then** it announces the label and current selection
- **And** available options when opened

## Dependencies
- Product filtering/sorting API
- Icon system (chevron)
