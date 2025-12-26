# Mobile Filter Toggle Component

## Overview
A sticky button that appears on mobile viewports to open the filter panel. Replaces the sidebar filter on smaller screens, providing access to filtering options via a modal or slide-in panel.

## Requirements

### Functional Requirements

1. **Toggle Button**
   - Filter icon with "Filter" text
   - Active filter count badge
   - Sort option toggle (optional)

2. **Positioning**
   - Fixed/sticky at bottom of viewport
   - Or in toolbar area below header
   - Always accessible while scrolling

3. **States**
   - Default state
   - Active (filters applied) with count
   - Loading state (optional)

4. **Interaction**
   - Tap opens filter modal/panel
   - Tap again or swipe closes
   - Results update on apply

### Non-Functional Requirements

1. **Performance**
   - Lightweight rendering
   - Smooth sticky behavior
   - No scroll jank

2. **Accessibility**
   - Clear touch targets (48px minimum)
   - Screen reader support
   - Focus management

3. **Responsive**
   - Only visible on mobile (< 768px)
   - Hidden on desktop

## Acceptance Criteria

### AC1: Mobile Visibility
- **Given** a mobile viewport (< 768px)
- **When** the page loads
- **Then** the filter toggle appears
- **And** the sidebar is hidden

### AC2: Desktop Hidden
- **Given** a desktop viewport (>= 768px)
- **When** the page loads
- **Then** the filter toggle is hidden
- **And** the sidebar is visible

### AC3: Open Filter Panel
- **Given** the filter toggle is displayed
- **When** the user taps it
- **Then** the filter panel opens
- **And** background content is dimmed

### AC4: Active Filter Count
- **Given** filters are applied
- **When** viewing the toggle
- **Then** a badge shows the count
- **And** the count updates in real-time

### AC5: Sticky Positioning
- **Given** the user is scrolling
- **When** scrolling down/up
- **Then** the toggle remains visible
- **And** doesn't interfere with content

## Dependencies
- Filter sidebar component (modal version)
- Product filtering state
