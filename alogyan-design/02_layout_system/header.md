# Header

**References:** Google Classroom (app bar approach), Notion (contextual top breadcrumbs).

## 1. Layout
Fixed to the top of the viewport. Spans 100% of the screen width to the right of the sidebar. Default height: 72px.

## 2. Components
- **Global Search:** Centered or left-aligned omnibar.
- **Quick Links:** "📢 New Announcement" button.
- **User Actions (Right):** Notification Bell (with red unread badge), User Avatar Dropdown.

## 3. Tables
N/A

## 4. Forms
The search bar acts as an immediate `GET` form that fetches async results on type.

## 5. Buttons
Primary Actions ("+") are solid colored (`#D32F2F`), User Profile is a circular image button.

## 6. UX Flow
Clicking the user avatar opens a distinct popover menu containing "Settings, Help, Sign Out".

## 7. Mobile Layout
Contains a Hamburger menu on the far left. The global search bar is collapsed behind a magnifying glass icon to save space.

## 8. Empty States
If no notifications exist, the dropdown displays: "You're all caught up! No new notifications."

## 9. Success States
When a new notification arrives, the bell icon gently rings/shakes with CSS animation for 2 seconds.

## 10. Error States
Search failures fallback gracefully within the search dropdown: "Search service unavailable."
