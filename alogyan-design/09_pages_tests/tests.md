# Screen: Tests & Assessments

The Tests module allows teachers to schedule offline tests, record marks, and visualize class performance. Online quiz functionality (if added later) would also stem from here.

## 1. Layout
- **Type:** Split View / List View.
- **Top Metrics:** Average Class Score, Highest Score, Upcoming Tests.
- **Main Area:** 
  - "Upcoming Tests" list (Assessments planned for the future).
  - "Past Tests" grid (Assessments that have occurred, showing average grades).

## 2. Components
- **Test Card:** 
  - Title: "Term 1 Pre-Board".
  - Subject/Batch: "Class 12 Physics".
  - Date & Time.
  - Status/Action: "Enter Marks" (if past date but ungraded), "View Results" (if graded).
- **Performance Chart:** A simple bar chart (visible inside the Test Detail view) showing the distribution of grades (e.g., 90-100: 5 students, 80-89: 12 students).

## 3. Tables
- **Marks Entry Table (Spreadsheet Style):**
  - Within a Specific Test's Details page.
  - Columns: Student Name, Max Marks (Label), Score (Input Field), Comments (Input Field).
  - Must support fast typing (Tab key navigates quickly down the "Score" column).

## 4. Forms
- **Create Test Modal:**
  - Field: Test Name.
  - Dropdowns: Select Batch, Subject.
  - Date Picker & Time: Date of the test.
  - Number Input: Maximum Marks (e.g., 100).
- **Marks Entry:** Inline form fields inside the table rows for rapid data entry.

## 5. Buttons
- **Global:** "+ Schedule Test" (Primary).
- **Cards:** "Enter Marks" (Primary Red for ungraded), "View Results" (Secondary Outline).
- **Inside Marks Table:** "Save Marks" (Sticky Bottom Bar).

## 6. UX Flow (Entering Marks)
1. Teacher sees "Test: Physics Mechanics" requires grading on Dashboard.
2. Clicks "Enter Marks", opening the Spreadsheet view for that test.
3. Teacher looks at physical answer sheets, types a mark next to Student 1, hits `Tab` or `Down Arrow`.
4. Types mark for Student 2, hits `Tab`. 
5. Completes the list rapidly without using a mouse.
6. Clicks "Save & Publish Marks" sticky button.
7. System calculates averages and creates the Performance Chart.

## 7. Mobile Layout
- Test Cards stack vertically.
- Grade Entry on Mobile: Spreadsheet view is difficult on mobile. Convert grade entry into a "Card per Student" swiping sequence (like Tinder or Flashcards). 
  - See Student Name -> Type Mark -> Tap "Next Student".

## 8. Empty States
- No upcoming/past tests: Graphic of an exam paper with an A+. "No tests scheduled. Challenge your students by planning an assessment."

## 9. Success States
- Toast: "Test 'Unit 1 Math' scheduled for Oct 15."
- Toast: "Marks published! Notifications sent to students/parents."

## 10. Error States
- Validation on marks entry: If maximum marks is 50, and teacher types '55', the input border turns Danger Red and a small tooltip says "Exceeds max possible marks of 50" before saving is allowed.
