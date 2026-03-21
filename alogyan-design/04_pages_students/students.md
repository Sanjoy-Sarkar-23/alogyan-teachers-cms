# Screen: Students

The Students module manages the directory of all enrolled students, their parents' contact info, and their enrollment status.

## 1. Layout
- **Type:** Standard Data Page (List View) & Detail Page (Student Profile).
- **List View:**
  - Full-width Search & Filter bar below the page header.
  - Primary Content: Full-width Table inside a unified Card.
- **Detail View:**
  - Left column profile card (Photo, Name, Parent Name, Phone, Email, Status Badge).
  - Right column tabs: Info, Progress (Tests), Financials (Fees), Attendance.

## 2. Components
- **Search Bar:** Large text input with a magnifying glass icon.
- **Filter Dropdown:** Filter by "Batch", "Status" (Active, Inactive).
- **Action Menu (Three dots `...`):** On each row for "View Profile", "Edit Student", "Remove".
- **Status Badges:** "Active" (Green), "Inactive" (Orange), "Removed" (Red).

## 3. Tables
- **Columns:** 
  1. Student Name (Avatar + Text)
  2. Batch/Class
  3. Parent Phone (Clickable/WhatsApp link)
  4. Joining Date
  5. Status (BadgeComponent)
  6. Actions (Icon button)
- **Pagination:** Fixed 20 items per page with "Previous" and "Next" buttons at the bottom right.

## 4. Forms
- **Add/Edit Student Form (Modal or Slider Drawer):**
  - Section 1: Personal Details (First Name, Last Name, Gender dropdown).
  - Section 2: Contact (Parent Phone, Student Phone, Email).
  - Section 3: Enrollment (Select Batches multiselect dropdown, Joining Date picker).

## 5. Buttons
- **Header:** "Primary Red" button labeled "+ Add Student".
- **Table Rows:** WhatsApp icon button for one-click parent messaging.

## 6. UX Flow
1. Navigates to Students.
2. Clicks "+ Add Student".
3. A side drawer slides from the right (to keep context). User fills out the simple form (using dropdowns where possible).
4. Submits form. Drawer closes. Table refreshes. Toast appears.

## 7. Mobile Layout
- **Table replacement:** Student Cards. 
  - Top: Avatar, Name, Status Badge.
  - Middle: Batch Name, Parent Phone.
  - Bottom: WhatsApp Button, "View Details" text link.
- **Filters:** Hidden behind an "Advanced Filters" icon next to the search bar.

## 8. Empty States
- **No Students Added:** Illustration of a classroom or desk. Text: "Your roster is empty. Add a student to get started." Button: "+ Add Student".
- **No Search Results:** "No students matching '[search query]'. Try clearing your filters."

## 9. Success States
- "Student added successfully" toast notification.
- "Message sent via WhatsApp" toast notification.

## 10. Error States
- **Form Error:** Red borders around missing required fields (e.g., "Parent Phone is required").
- **Duplicate Data:** "A student with this phone number already exists." in a Warning Orange alert banner at the top of the form.
