# Attendance Reports

**References:** Stripe (Analytics dashboards), Zoho (exportable charts).

## 1. Layout
Dashboard style widget view. Top area contains global date range and batch filters.

## 2. Components
- **Percentage KPI Card:** "Overall Attendance: 85%".
- **Line Chart (Time Series):** Showing attendance percentage dipping or rising week by week.
- **Top Absentees List:** "Students below 50% attendance."

## 3. Tables
A detailed "Export Ready" table at the bottom: Student Name | Days Present | Days Total | Attendance %.

## 4. Forms
Filters only. Single Date Range picker handling Start/End dates intuitively.

## 5. Buttons
"Export as CSV", "Export as PDF" (Secondary Outline buttons in header).

## 6. UX Flow
Admin needs to print the attendance to show parents -> Switches to Attendance Reports -> Selects Last Month -> Clicks Export PDF -> Prints file.

## 7. Mobile Layout
Charts utilize horizontal scrolling if data points exceed mobile viewport width, rather than cramming UI unreadably.

## 8. Empty States
"No classes held in this date range. Select a different period."

## 9. Success States
"Report successfully generated." (With an automatic file download trigger).

## 10. Error States
"Timeout: Please select a shorter date range for calculation (Max 1 Year)."
