# Screen: Batches

The Batches module organizes students into manageable groups (e.g., "Class 10 Math Weekend", "Morning Yoga A").

## 1. Layout
- **Type:** Standard Data Page (Card Grid) & Detail Page.
- **List View:**
  - Instead of a table, we use a **Grid of Cards** representing each Batch. This is more visually appealing since there are usually fewer batches than students.
- **Detail View:**
  - Header: Batch Name, Subject, Timings.
  - Layout: Table of Students enrolled in this specific batch.

## 2. Components
- **Batch Card:** 
  - Contains: Batch Title (H3), Subject tag, Timing (e.g., "M/W/F • 5:00 PM"), Count of Students (e.g., "👥 24/30"), and a progress bar showing attendance average.
- **Dropdown List:** Inside the Batch detail to quickly add existing students.

## 3. Tables
- **Batch Roster Table ( inside Detail View):**
  - Columns: Serial No., Student Name, Phone, Recent Attendance (Mini line chart or last 3 days status `[P][A][P]`), Actions.

## 4. Forms
- **Create Batch Form (Modal):**
  - Fields: Batch Name, Subject (Dropdown/Creatable), Maximum Capacity, Schedule (Checkbox group for Days: M, T, W, Th, F, S, Su + Time Picker).

## 5. Buttons
- **Header:** "+ Create Batch" (Primary Red).
- **Cards:** "Manage Batch" (Secondary/Ghost) on hover or at the bottom of the card.
- **Detail View:** "Add Student to Batch" (Secondary button, beside search).

## 6. UX Flow
1. Admin views grid of Batches.
2. Clicks "+ Create Batch" -> Fills Modal -> Confirms.
3. Clicks on the new Batch Card -> Opens Detail View.
4. Uses search dropdown to bulk-select existing students and add them to the batch.

## 7. Mobile Layout
- Grid of Cards converts to a single vertical scrollable column of Cards.
- Action buttons inside cards span 100% width.
- Inside Detail View, the Student List converts to stacked individual student cards.

## 8. Empty States
- Text: "You haven't created any batches yet. Group your students to manage them efficiently." Graphic: Empty schedule/calendar.
- Inside an empty Batch: "No students in this batch. Add students to start teaching."

## 9. Success States
- Toast: "Batch 'Class 10 Science' created."
- Toast: "5 students added to the batch."

## 10. Error States
- Validations: "Batch name cannot be empty."
- Conflict: "This time slot overlaps with 'Class 9 Math'." (Warning prompt, allows override but alerts the user).
