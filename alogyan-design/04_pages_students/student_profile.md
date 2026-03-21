# Student Profile

**References:** Zoho CRM (detailed contact records), Notion (tabbed data organization).

## 1. Layout
A visually robust 2-column detail view. Left: Fixed Profile Card. Right: Tabbed scrollable robust data area.

## 2. Components
- **Profile Card:** Avatar, Full Name, Grade, Batch assignment (`Badge`), Parent Contact Info (WhatsApp link).
- **Tabs:** Overview, Attendance, Test Scores, Fee History.

## 3. Tables
Test Scores and Fee History act as dedicated data tables inside their respective tabs. Clean, sortable by Date.

## 4. Forms
In-place editing. Clicking "Edit Profile" directly swaps the readable text on the left card into form inputs.

## 5. Buttons
Primary Actions span the top right header area (e.g., "Add Test Score", "Record Fee").

## 6. UX Flow
From the Student List -> clicks row -> transitions smoothly into Student Profile retaining the "Back" breadcrumb.

## 7. Mobile Layout
Left profile card becomes top profile card. Tabs lock below the card and the right-column data scrolls vertically below.

## 8. Empty States
If a student has zero test scores recorded, the "Test Scores" tab shows: "No exams recorded yet. Schedule a test to see progress."

## 9. Success States
Updating a parent phone number shows a subtle green toast: "Contact info updated."

## 10. Error States
"Unable to load fee history. Please refresh." using a red warning banner within the specific tab.
