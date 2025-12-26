# Page Header Component

## Overview
A prominent section header used on category and listing pages to display the current page title, context, and optional description. The page header establishes visual hierarchy and helps users understand their location within the site.

## Requirements

### Functional Requirements

1. **Title Display**
   - Display page title prominently
   - Support for dynamic title text
   - Support for title with product count (e.g., "Men's New Releases (234)")
   - Truncation for very long titles

2. **Subtitle/Description**
   - Optional subtitle or description text
   - Support for multi-line descriptions
   - HTML formatting support for links within description

3. **Visual Hierarchy**
   - Clear typographic hierarchy
   - Consistent with Nike brand typography
   - Proper spacing from surrounding content

4. **Responsive Behavior**
   - Full-width on all viewports
   - Font size adjustments for mobile
   - Proper padding adjustments

### Non-Functional Requirements

1. **Performance**
   - Render immediately (above fold content)
   - No layout shift during page load

2. **Accessibility**
   - Semantic heading structure (h1)
   - Sufficient color contrast
   - Screen reader support

3. **SEO**
   - Proper heading hierarchy
   - Meaningful heading text

## Acceptance Criteria

### AC1: Title Rendering
- **Given** a page header component
- **When** the page loads
- **Then** the title displays in the designated heading style
- **And** the title is the h1 element of the page

### AC2: Product Count Display
- **Given** a page header with product count
- **When** the page loads
- **Then** the count appears in parentheses after the title
- **And** the count updates when filters change

### AC3: Subtitle Display
- **Given** a page header with subtitle
- **When** the page renders
- **Then** the subtitle appears below the main title
- **And** uses secondary typography styling

### AC4: Mobile Responsiveness
- **Given** a mobile viewport
- **When** the page header renders
- **Then** the font size adjusts appropriately
- **And** padding scales for mobile

### AC5: Accessibility
- **Given** the page header
- **When** a screen reader reads the page
- **Then** the header is announced as the page heading
- **And** provides context for the page content

## Dependencies
- Typography system
- Responsive breakpoint system
