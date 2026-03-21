# Sidebar

**References:** Notion (collapsible lightweight sidebar), Discord (server icons representation).

## 1. Layout
Fixed 240px left-aligned container. White background with a faint right border (`1px solid #E0E0E0`).

## 2. Components
- **Top Branding:** Alogyan Logo.
- **Navigation Links:** Icons + Text labels. Hover state displays a light `#F5F5F5` background.
- **Active Link:** Bold text and `#FFEBEE` (Light Red) background with `#D32F2F` icon.

## 3. Tables
N/A

## 4. Forms
N/A

## 5. Buttons
Secondary navigation utilizes ghost buttons. A "Collapse Sidebar" button sits at the top right corner of the container.

## 6. UX Flow
Clicking a link updates the main content area seamlessly. If collapsed, hovering over an icon reveals a tooltip naming the module.

## 7. Mobile Layout
Hidden entirely. Fully replaced by the generic Hamburger menu or Bottom Navigation Bar.

## 8. Empty States
N/A

## 9. Success States
N/A

## 10. Error States
If a module is unauthorized (e.g. Free Tier attempting to click 'Analytics'), a lock icon (`🔒`) is displayed over the text. Clicking invokes an upgrade toast.
