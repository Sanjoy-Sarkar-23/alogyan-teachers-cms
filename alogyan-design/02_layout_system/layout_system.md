# Layout System

The Alogyan Platform Layout System provides the structural foundation for all screens. It uses a flexible, responsive container approach to ensure usability from desktop down to mobile.

## 1. Global Structure

### Desktop (1024px and above)
- **Sidebar (Left):** 240px fixed width, 100vh height, sticky position. Contains the main navigation menu, user profile snippet at the bottom, and branding at the top.
- **Top Header:** 72px fixed height, stretches from the right edge of the sidebar to the right edge of the screen. Contains Global Search, Breadcrumbs (if applicable), and Notification bell.
- **Main Content Area:** Occupies the remaining space. Features a maximum width constraint (e.g., 1200px) or fluid 100% width with 40px padding depending on the screen content. Background color is Light Background (`#F8F9FA`).

### Tablet (768px - 1023px)
- **Sidebar:** Collapses to 80px fixed width (Icon-only mode). On hover, it can optionally expand to 240px as an overlay.
- **Top Header:** Stretches from the 80px sidebar to the right edge.
- **Main Content Area:** Fluid width, 24px padding.

### Mobile (Default: < 768px)
- **Sidebar:** Hidden completely. Navigation is moved to a bottom tab bar (for core modules) OR a Hamburger Menu that opens a full-screen or 80vw drawer.
- **Top Header:** Full width, contains Hamburger Menu icon on left, branding center, and notifications right.
- **Main Content Area:** Full width, 16px padding. 
- **Bottom Navigation (Optional):** Fixed at the bottom containing "Home", "Students", "Batches", and "More".

## 2. Page Level Layouts

### Standard Data Page (e.g., Students, Batches)
- **Page Header Area:** Contains Page Title (H1) on the left, and Primary Action Button (e.g., "Add Student") on the right.
- **Filters/Search Bar:** A card or prominent row below the Page Header containing search input and dropdown filters.
- **Data Display:** Typically a Card containing a Table (Desktop) or a List of Cards (Mobile).
- **Pagination:** At the bottom right of the Data Display.

### Detail Page (e.g., Student Profile)
- **Page Header:** Back button ("← Back to Students"), Title (Student Name), Status Badge ("Paid"), and Actions ("Edit", "Delete") on the right.
- **Content Splitting:** 
  - **Left Column (approx 30%):** Summary Card (Profile picture, contact info, overall status).
  - **Right Column (approx 70%):** Tabbed interface ("Attendance", "Fees", "Tests", "Notes") containing detailed data cards.

## 3. Z-Index System
- **Base Content:** 0 to 10
- **Sticky Header:** 100
- **Sidebar:** 200
- **Dropdowns / Popovers:** 300
- **Modals / Dialogs:** 400
- **Toasts / Snacks:** 500

## 4. Grid System
- Desktop forms/layouts utilize a 12-column CSS Grid.
- Gaps are standardized to `16px` for compact layouts and `24px` for relaxed layouts.
- Cards stretch to fill grid columns.
