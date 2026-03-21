# Create Test

**References:** Google Forms (Assessment creation), Quizlet (Simple UI).

## 1. Layout
A dedicated "Focus Mode" full-page layout to avoid distractions while configuring the test parameters.

## 2. Components
- **Input Fields:** Test Name, Subject, Batch.
- **Date & Time Pickers:** Configurable test window.
- **Number Input:** Total Maximum Marks.

## 3. Tables
N/A

## 4. Forms
Grouped into "Basic Details" (Subject, Batch) and "Assessment Details" (Date, Max Marks).

## 5. Buttons
Default "Cancel" (Ghost) on the left, "Schedule Test" (Primary Solid Red) on the right footer.

## 6. UX Flow
Admin clicks `+ Create Test` -> Fills in "Unit test 1" -> Assigns to "Class 10" -> Selects Date -> Sets Max Marks to 50 -> Clicks Save. List updates.

## 7. Mobile Layout
Full-screen setup wizard style. A simple scrollable single column.

## 8. Empty States
N/A

## 9. Success States
"Test successfully scheduled." and navigates back to the Tests List.

## 10. Error States
"End Time cannot be earlier than Start Time." with inline validation text in red below the time picker.
