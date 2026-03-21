# Screen: Reports & Analytics

The Reports module aggregates data from Attendance, Fees, and Tests to provide a comprehensive health check of the classes and individual student performances.

## 1. Layout
- **Type:** Dashboard Style with multiple independent data visualization widgets.
- **Top Filter:** Global Date Range Picker (e.g., "Last 30 Days", "This Quarter", "Custom Range") and Batch Selector.
- **Main Area (Grid):**
  - Widget 1: Revenue Chart (Bar/Line).
  - Widget 2: Attendance Trends (Line Graph).
  - Widget 3: Top Performing Students (List).
  - Widget 4: At-Risk Students (List).

## 2. Components
- **Charts:** Usage of a minimalist charting library. Clean lines, brand colors (Red, Green, Blue). Hover tooltips on data points.
- **Date Range Picker Dropdown:** A clean UI allowing fast presets before falling back to manual calendar picking.
- **"At-Risk" Alerts:** Cards highlighting students with < 50% attendance or failing multiple tests.

## 3. Tables
- **Detailed Export Table:** Placed at the very bottom. A master list of all selected data (e.g., Student | Attendance % | Fee Paid | Average Score) ready to be exported.

## 4. Forms
- Only filter and parameter forms. No data entry forms on this page.

## 5. Buttons
- **Global Actions:** "Export as PDF", "Export as CSV" (Secondary outline buttons positioned in the header area).

## 6. UX Flow (Checking "At-Risk" Students)
1. Teacher switches view to "Reports".
2. Looks at the "At-Risk Students" widget automatically generated based on low recent attendance.
3. Clicks on a student name -> Opens a modal or directs to the Student Profile.
4. From the profile, the teacher uses the WhatsApp button to message the parent asking about repeated absences.

## 7. Mobile Layout
- **Charts:** Must be highly responsive, falling back to simplified bar charts or just the key aggregated numbers if the screen is too narrow to properly display a line graph.
- Widgets stack vertically. 
- "Export" features may be limited or require sending an email to the user's registered address instead of direct downloading to a mobile filesystem.

## 8. Empty States
- If no data exists for the selected timeframe: "Not enough data available for this range. Try selecting a broader date range."

## 9. Success States
- Toast: "Report generating... Download will start shortly."
- Toast: "Report sent to your registered email address."

## 10. Error States
- If the queried date range is too vast (e.g., 5 years) and times out: "Data load taking too long. Please shorten your date range."
