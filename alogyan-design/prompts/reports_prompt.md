# Prompt: Analytics & Reports Module

**Context:** Build the data visualization dashboard (`/reports`).

**System Prompt Injection:**
`Read and apply the rules from master_prompt.md before proceeding.`
`Refer to 10_pages_reports/analytics_dashboard.md for detailed specs.`

**Task:**
Generate an aggregated metrics Dashboard using a charting library placeholder (like Recharts) in Next.js.
1. **Interactive Filter Bar:** Produce a sticky header containing a `<select>` for Batch and a Date Range Picker input. Include a secondary "Export Report" button on the right.
2. **Chart Widgets:** Create at least two major chart placeholders: A Line Chart for "Revenue Trends" and a Bar Chart for "Attendance Distribution". Ensure they are contained within `bg-white rounded-xl shadow-sm` cards.
3. **Top Lists:** Below the charts, create two visually distinctive ranking lists: "Top Performing Students" and "At-Risk Students" (styled with slight warning/red background tints).
4. **Responsive Integrity:** Ensure that the chart containers have `min-w-full overflow-x-auto` to prevent them from breaking the mobile viewport on tiny screens.
