# Breadcrumb Navigation Component

## Overview
A horizontal navigation trail that displays the user's current location within the site hierarchy. Breadcrumbs help users understand their position and navigate back to parent pages.

## Requirements

### Functional Requirements

1. **Navigation Trail**
   - Display hierarchical path from home to current page
   - Each level is a clickable link (except current page)
   - Separator between levels (typically "/" or ">")
   - Current page displayed without link

2. **Link Behavior**
   - All parent levels link to respective pages
   - Smooth navigation without page reload (SPA)
   - Right-click context menu support
   - Middle-click opens in new tab

3. **Truncation**
   - Support for long breadcrumb trails
   - Ellipsis for middle levels on mobile
   - Always show first and last items

4. **Dynamic Updates**
   - Update when navigating via filters
   - Reflect category drill-down
   - Support for product detail context

### Non-Functional Requirements

1. **Performance**
   - Render immediately with page
   - No layout shift during load

2. **Accessibility**
   - Use nav element with aria-label
   - Ordered list structure
   - Current page indicated with aria-current
   - Screen reader announces trail

3. **SEO**
   - Schema.org BreadcrumbList markup
   - Proper heading hierarchy

## Acceptance Criteria

### AC1: Trail Display
- **Given** a user on a category page
- **When** the page loads
- **Then** the breadcrumb shows: Home > Category > Subcategory
- **And** separators appear between each level

### AC2: Link Navigation
- **Given** a breadcrumb trail with multiple levels
- **When** the user clicks a parent level
- **Then** they navigate to that page
- **And** the URL updates appropriately

### AC3: Current Page
- **Given** the current page in breadcrumb
- **When** the page renders
- **Then** the current page is not a link
- **And** it has distinct styling

### AC4: Mobile Truncation
- **Given** a long breadcrumb trail
- **When** viewed on mobile
- **Then** middle items are collapsed with "..."
- **And** tapping expands the full trail

### AC5: Screen Reader
- **Given** a breadcrumb navigation
- **When** a screen reader reads the page
- **Then** it announces "Breadcrumb navigation"
- **And** reads each level in order

## Dependencies
- Router/navigation system
- Schema.org structured data
