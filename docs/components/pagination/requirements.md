# Pagination Component

## Overview
A navigation component that allows users to browse through multiple pages of product results or load additional content. Supports both traditional pagination and "Load More" patterns.

## Requirements

### Functional Requirements

1. **Pagination Display**
   - Page number buttons
   - Previous/Next arrows
   - First/Last page shortcuts (optional)
   - Current page indicator

2. **Load More Variant**
   - Single button to load more items
   - Progress indicator ("Showing X of Y")
   - Infinite scroll trigger option

3. **Navigation**
   - Click page number to jump
   - Previous/Next navigation
   - Disable at boundaries (first/last)

4. **State Display**
   - Current page highlighted
   - Total pages indicated
   - Results range display

### Non-Functional Requirements

1. **Performance**
   - Smooth page transitions
   - Preserve scroll position option
   - Prefetch next page (optional)

2. **Accessibility**
   - Keyboard navigable
   - Screen reader support
   - ARIA labels for buttons
   - Clear focus states

3. **Responsive**
   - Condensed view on mobile
   - Touch-friendly targets

## Acceptance Criteria

### AC1: Page Navigation
- **Given** a paginated list on page 1
- **When** user clicks page 3
- **Then** content updates to page 3
- **And** page 3 is highlighted

### AC2: Previous/Next
- **Given** current page 5
- **When** user clicks Previous
- **Then** content updates to page 4
- **And** page 4 is highlighted

### AC3: First Page Boundary
- **Given** current page is 1
- **When** page loads
- **Then** Previous button is disabled
- **And** user cannot go before page 1

### AC4: Load More
- **Given** a load more button
- **When** user clicks it
- **Then** more products append to list
- **And** progress updates

### AC5: Keyboard Navigation
- **Given** focus on pagination
- **When** user uses Tab and Enter
- **Then** can navigate between pages

## Dependencies
- Product listing API with pagination support
