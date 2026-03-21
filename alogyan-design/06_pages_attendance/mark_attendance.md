# Mark Attendance

**References:** Google Classroom (checkbox interfaces), WhatsApp Web (speed selection).

## 1. Layout
A dedicated "Focus Mode" list view taking over the screen. No distracting sidebars on mobile, just the list of names.

## 2. Components
- **Header:** Sticky. "Class 10 Science - Oct 24". Contains a global "Save" button right-aligned.
- **Toggle Elements:** Large segmented controls `(P) (A) (L)` next to each student's name.

## 3. Tables
N/A - Functionally behaves as a table, visually behaves as a stacked list of Card Rows.

## 4. Forms
The whole page is a single asynchronous form. Changes highlight but don't commit until "Save" is clicked.

## 5. Buttons
Default top-right action: `Mark All Present` (Ghost Button). Bottom or top right action: `Submit Attendance` (Primary Red).

## 6. UX Flow
The teacher walks into class, clicks "Mark Attendance", hits "Mark all Present", then scrolls down and taps "A" only for the 2 absent students, hits "Save". Process takes < 10 seconds.

## 7. Mobile Layout
Segmented controls `[P|A|L]` must span at least 150px of width to avoid fat-finger tapping errors.

## 8. Empty States
"No students found in this batch."

## 9. Success States
"Attendance saved." Returns teacher to Dashboard.

## 10. Error States
If offline, a yellow banner reads: "Offline mode. Attendance will sync automatically when your connection returns."
