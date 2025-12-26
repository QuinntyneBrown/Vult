# Result Counter Component

## Overview
A simple text display component that shows the number of products matching the current filters and search criteria. Appears in the toolbar area above product grids.

## Requirements

### Functional Requirements

1. **Count Display**
   - Show total number of matching products
   - Format: "X Results" or "X Products"
   - Support for singular/plural forms

2. **Dynamic Updates**
   - Update count when filters change
   - Update on search query changes
   - Animate count changes (optional)

3. **Loading State**
   - Show loading indicator while fetching
   - Skeleton placeholder option

### Non-Functional Requirements

1. **Performance**
   - Lightweight rendering
   - Efficient updates

2. **Accessibility**
   - Live region for screen readers
   - Announces count changes

## Acceptance Criteria

### AC1: Count Display
- **Given** products are loaded
- **When** the page renders
- **Then** "234 Results" displays
- **And** the number reflects actual count

### AC2: Singular Form
- **Given** only one product matches
- **When** the page renders
- **Then** "1 Result" displays (singular)

### AC3: Filter Update
- **Given** a filter is applied
- **When** products are filtered
- **Then** the count updates immediately
- **And** screen readers announce the change

### AC4: Zero Results
- **Given** no products match filters
- **When** the page renders
- **Then** "0 Results" displays

## Dependencies
- Product filtering state
