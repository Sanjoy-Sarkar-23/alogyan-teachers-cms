# Attendance Calendar

**References:** Google Calendar (Month view), Notion (calendar database).

## 1. Layout
A full-page calendar interface (Month view standard). Clicking a date opens a slide-over showing batch attendance for that day.

## 2. Components
- **Calendar Grid:** 7 columns, 5-6 rows based on the month.
- **Micro-Indicators:** Small red/green dots inside a calendar square representing "Class held, attendance taken" or "Class held, pending attendance".

## 3. Tables
N/A - Handled via CSS Grid imitating a traditional calendar layout.

## 4. Forms
Batch Selector dropdown at the very top to filter the calendar view.

## 5. Buttons
"< Prev", "Next >" month navigation buttons located next to the "October 2026" title label.

## 6. UX Flow
Teacher wants to verify exactly how many days total the batch was taught this month -> Switches to Calendar View -> Scans for green dots visually.

## 7. Mobile Layout
Full month view is too condensed. Converts to a scrolling "Agenda" or "List View" of days where classes actually occurred.

## 8. Empty States
If no batch selected: "Please select a batch above to view its monthly calendar."

## 9. Success States
Today's date is heavily highlighted with a Primary Red `#D32F2F` circle behind the number.

## 10. Error States
"Unable to fetch historical calendar data."
