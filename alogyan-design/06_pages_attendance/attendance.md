# Screen: Attendance

The Attendance module allows teachers to quickly record and view student presence for a specific batch on a specific date. Speed is the primary goal here.

## 1. Layout
- **Type:** List View (Interactive List).
- **Core Layout:**
  - Header: Date Picker (Defaults to Today) and Batch Dropdown Selector.
  - Body: A vertical list of students in the selected batch, each acting as a toggleable row.
  - Footer: "Save Attendance" contextual action bar.

## 2. Components
- **Date Picker:** Left/Right arrows adjacent to a readable date format (e.g., `< Mon, Oct 24 >`).
- **Batch Dropdown:** Large, clear dropdown taking up the top-right or center depending on the layout.
- **Attendance Toggles:** Custom Radio Buttons or segmented controls (P, A, L) per student row. 
- **Summary Bar (Sticky Bottom):** "24 Present, 2 Absent, 0 Late".

## 3. Tables
- **Table-like List View:**
  - Row 1: Student Avatar, Name, Phone.
  - Row 2 (or Right aligned columns): Status Toggles for `[ Present ]` (Green text), `[ Absent ]` (Red text), `[ Late ]` (Orange text).

## 4. Forms
- The entire page acts as one large asynchronous form. Each toggle updates a local state, requiring a single "Save" confirmation.
  
## 5. Buttons
- **Submit Button:** Large Floating Action Bar or Sticky Bottom bar with a Primary Red "Save Attendance" button.
- **Toggle Buttons:** Default state (Ghost/Border), Active state (Solid Color - Green/Red/Orange).
- **"Mark All Present" Button:** Ghost or Secondary button at the top of the list to rapidly fill the default state.

## 6. UX Flow
1. Select Batch (if not prepopulated from Dashboard schedule click).
2. Date is pre-selected (Today).
3. Click "Mark All Present".
4. Scroll down, tapping the "Absent" button for the 1 or 2 students not there.
5. Click "Save Attendance".
6. Success Toast -> Redirects back or stays for the next batch.

## 7. Mobile Layout
- The optimal layout is a long vertical card list. 
- Each Student Card contains the Name on the left, and a segmented toggle `(P | A | L)` on the right.
- Sticky Submit button fixed to the bottom edge of the viewport.

## 8. Empty States
- If no batch is selected: "Please select a batch from the dropdown above to mark attendance."
- If the batch has no students: "There are no students in this batch yet." + "Manage Batch" secondary button.

## 9. Success States
- Success checkmark animation inside the Save button.
- Toast: "Attendance recorded successfully for 30 students."

## 10. Error States
- If internet disconnects while saving: "Error saving attendance. Please check your connection and try again." (With a Retry button).
