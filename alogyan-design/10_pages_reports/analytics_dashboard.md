# Analytics Dashboard

**References:** Stripe (Dashboard widget grid).

## 1. Layout
Heavy visualization screen. 2-column or 3-column grid of widget cards displaying graphs, charts, and top-tier metrics.

## 2. Components
- **Time/Date Filter:** Global overriding widget mapping to all charts.
- **Line Charts:** Revenue over time, Attendance trends.
- **Top Lists:** Highlight top performers and at-risk students.

## 3. Tables
A final data dump table at the very bottom containing raw aggregated stats for export.

## 4. Forms
Date selection range (e.g., `<input type="date">` elements wrapped in a nice UI).

## 5. Buttons
"Export Complete Report" (Secondary Button, top right).

## 6. UX Flow
Visually scan overall health -> Notice attendance dip -> Hover over chart to see exact week -> Click export for deep dive.

## 7. Mobile Layout
Charts stack sequentially. Responsive SVG charting scales down automatically, prioritizing the Y-axis readability.

## 8. Empty States
If no classes took place in the filtered month: "No actionable data available for this timeframe."

## 9. Success States
Generating export triggers a toast with a loading spinner, finalizing in a green checkmark download.

## 10. Error States
"Data timeout. Please select a timeframe shorter than 2 years."
