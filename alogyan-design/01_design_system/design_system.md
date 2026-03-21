# Alogyan Design System

**Version:** 1.0
**Product:** Alogyan - Education Discovery and Teacher Management Platform

The Alogyan Platform design is centered around a simple, user-friendly interface optimized for non-technical teachers and small institutes. It is heavily inspired by modern SaaS platforms like Google Classroom, Notion, Razorpay Dashboard, WhatsApp Web, Zoho, and Stripe Dashboard. 

## 1. Core Principles
- **Simple UI:** Maintain a clean interface with clear calls to action. Important actions are visible on screen.
- **Large, Readable Typography:** Use approachable, large font sizes for rapid readability.
- **Card-Based Layout:** Use cards to segment content into digestible chunks.
- **Minimal Steps:** Optimize UX flows to complete tasks with the fewest clicks.
- **Sidebar Navigation:** A clear left-aligned sidebar for easy module switching.
- **Mobile Responsive:** All experiences must be seamless on desktop, tablet, and mobile.
- **Friendly Education Theme:** Combining professionalism with approachability.
- **Dropdowns over Typing:** Reduce cognitive load and entry errors whenever possible.

---

## 2. Color Palette
The color system ensures hierarchy and clearly communicates status (Paid, Due, Present, Absent).

### Brand Colors
- **Primary Red:** `#D32F2F` (Used for primary buttons, active states, and brand highlights - *reminiscent of strong educational marks*)
- **Primary Hover:** `#B71C1C`

### Status / Semantic Colors
- **Success Green:** `#2E7D32` (Used for "Paid", "Present", "Success")
- **Warning Orange:** `#F57C00` (Used for "Due", "Pending", "Warning")
- **Danger Red:** `#C62828` (Used for "Absent", "Overdue", "Destructive Actions")
- **Info Blue:** `#1565C0` (Used for general information, links)

### Neutrals / Backgrounds
- **Light Background:** `#F8F9FA` or `#F4F5F7` (App backdrop color, soft on the eyes)
- **Card Background:** `#FFFFFF` (Pure white for elevated content)
- **Border Color:** `#E0E0E0` (Subtle dividers between areas)

### Text Colors
- **Primary Text:** `#212121` (High contrast for max readability)
- **Secondary Text:** `#757575` (For helper text, metadata, tables)
- **Disabled Text:** `#BDBDBD`
- **White Text:** `#FFFFFF` (Used on primary/status colored backgrounds)

---

## 3. Typography
**Font Family:** `Inter`, `Roboto`, or `Outfit` (Modern, clean sans-serif families). 
*Note: We will use `Inter` as the primary functional SaaS font for maximum legibility across devices.*

- **Dashboard / Page Heading (H1):** 28px/32px Bold (Tracking: -1%)
- **Section Heading (H2):** 22px Bold
- **Card Title (H3):** 18px Semi-Bold
- **Component Title (H4):** 16px Medium
- **Body Text:** 16px Regular (For readable paragraphs/notes)
- **Small / Meta Text:** 14px Regular (For tables, secondary info)
- **Micro Text:** 12px Medium (For badges and minor labels)
- **Button Text:** 16px Medium (or 14px Medium depending on button size)

---

## 4. Spacing System
Based on a strict **8px Grid System**.

- **4px / 8px:** Micro spacing (between icon and text inside a button)
- **16px:** General component padding, standard gap between rows.
- **24px:** Minimum Card Padding
- **32px:** Section Spacing (Spacing between different visual modules or headers)
- **40px / 48px:** Page level padding (Outer wrapper padding on Desktop)

---

## 5. UI Components

### Buttons
- **Primary:** Solid `#D32F2F` background, white text. Rounded corners (6px or 8px).
- **Secondary:** Transparent background, `#E0E0E0` border, primary text.
- **Ghost/Tertiary:** No background, `#D32F2F` or `#757575` text. Used for less important actions.
- **Sizes:** 
  - Large (48px height)
  - Default (40px height)
  - Small (32px height)

### Cards
- **Background:** `#FFFFFF`
- **Border Radius:** 12px (soft approachability)
- **Border:** `1px solid #E0E0E0`
- **Shadow:** Subtle drop shadow (e.g. `0 2px 8px rgba(0,0,0,0.05)`)
- **Padding:** 24px default.

### Tables
- **Header Row:** Light grey background (`#F5F5F5`), 14px Semi-Bold text.
- **Row:** White background, 1px bottom border. Hover effect (`#FAFAFA`).
- **Data Text:** 14px Regular.
- **Density:** Roomy padding (`12px 16px` per cell) for readability.

### Forms & Input Fields
- **Fields:** `1px solid #E0E0E0` border, `16px` padding (comfortable click area). 6px border-radius.
- **States:** Focus (`1px solid #D32F2F`), Error (`1px solid #C62828`).
- **Labels:** 14px Medium above the input field.
- **Selection:** Heavily rely on Dropdown components instead of text fields (per design principles).

### Badges / Status Tags
Small pill-shaped containers for status ("Paid", "Present").
- **Shape:** Border-radius 100px.
- **Padding:** 4px 10px.
- **Typography:** 12px Medium.
- **Coloring:** Soft light background matching the status color with bold text (e.g., Light Green Background `#E8F5E9` with Dark Green Text `#1B5E20`).

### Navigation Components
- **Sidebar:** Left-aligned. `#FFFFFF` background. Icons + Text (15px Medium) for each module. Active state shows a subtle Red background (`#FFEBEE`) and Red text/icon.
- **Header:** Sticky top. Contains Page Title on the left, Global Actions (Search, Notifications, User Profile) on the right.
- **Tabs:** Underlined style. Active tab gets a `#D32F2F` bottom border (2px) and bold text color.

### Modals
- Centers on screen with a dark overlay (`rgba(0,0,0,0.5)` backdrop).
- Card-style container (Max-width: 500px depending on context) with rounded corners (12px), title, close (X) button, content area, and fixed bottom action bar.

---

## 6. Responsive Layout Guidelines

### Desktop (1024px+)
- **Sidebar:** Fixed left (width ~240px).
- **Header:** Fixed top (height ~72px).
- **Main Content:** Padded container next to sidebar. `padding: 40px`.
- **Layout:** Tables can display up to 6-8 columns comfortably. Multi-column forms (e.g. `grid-cols-2`).

### Tablet (768px - 1023px)
- **Sidebar:** Collapsed into an Icon-only sidebar (width ~80px) to maximize screen space.
- **Header:** Fixed top.
- **Main Content:** `padding: 24px`.
- **Layout:** Tables start to hide secondary data columns. Forms switch to mostly 1-column layouts unless inputs are small.

### Mobile (320px - 767px)
- **Navigation:**
  - Sidebar is completely hidden. 
  - Accessed via a Hamburger menu in the Header or a Bottom Navigation Bar for primary modules (Home, Students, Matches, Menu).
- **Main Content:** `padding: 16px`.
- **Layout:** 
  - 100% width on all components. 
  - Tables format is converted into vertically stacked Cards (Card-based lists). A single "Student Card" shows Name, Status Badge, and key stats vertically arranged to avoid horizontal scrolling.
  - Buttons take the full width of the container. 
  - Modals stretch to full height/width or act as bottom-sheet drawers.
