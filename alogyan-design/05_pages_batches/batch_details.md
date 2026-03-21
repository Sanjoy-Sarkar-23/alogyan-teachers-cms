# Batch Details

**References:** Google Classroom (class streams and student rosters), Notion (inline databases).

## 1. Layout
Split view. Top Header banner showing the Subject and Time. Main body split into "Students in Batch" and "Upcoming Schedule".

## 2. Components
- **Details Banner:** "Class 10 Physics • MWF 5PM • 24 Enrolled".
- **Student Roster:** Table of students currently within this grouping.

## 3. Tables
Identical to `students_list.md` but hard-filtered to only show students inside this selected batch.

## 4. Forms
In-line addition form: "Add existing student by name..." with an auto-predictive dropdown.

## 5. Buttons
"+ Add Student to Batch" (Secondary action button).

## 6. UX Flow
Admin clicks a batch card -> views the roster to check capacity -> adds a new enrollment directly from the roster view.

## 7. Mobile Layout
Banner details are condensed. Student roster becomes vertically scrollable cards.

## 8. Empty States
"This batch is empty! Enroll students to begin teaching."

## 9. Success States
Toast: "Rahul successfully assigned to Class 10 Physics."

## 10. Error States
"Cannot assign student: Class 10 Physics is at its 30/30 seat capacity limit."
