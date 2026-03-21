# Screen: Dashboard Home

The Dashboard is the landing page for the teacher/admin after logging in. It provides an at-a-glance view of the most important metrics, pending tasks, and recent activities.

## 1. Layout
- **Type:** Standard Data Page with Widget Grid.
- **Top Section:** Greeting ("Welcome back, [Teacher Name]") and quick stats cards.
- **Middle Section:** 2-column grid. Left: "Today's Schedule" (Batches/Classes). Right: "Pending Actions" (Unpaid fees, unmarked attendance).
- **Bottom Section:** Recent Announcements or Recent Tests overview.

## 2. Components
- **Stats Cards (4):** White cards with an icon, numeric value (large font), label (small font), and a subtle trend indicator. 
  - Total Students, Active Batches, Monthly Revenue, Pending Fees.
- **Schedule List:** A vertical list component showing Time, Batch Name, Subject, and a quick action button ("Mark Attendance").
- **Alert Banner:** Used sparingly for system alerts or critical generic actions (e.g., "Your trial ends in 3 days").

## 3. Tables
- No traditional complex tables on the dashboard. Instead, we use **List Views** (simplified tables without headers, focusing on the row data) for Today's Schedule and Pending Actions.

## 4. Forms
- None directly on the dashboard. Forms are accessed via Modals triggered by dashboard quick actions.

## 5. Buttons
- **Quick Action Buttons:** Primary buttons alongside headers (e.g., "New Announcement", "Create Batch").
- **Inline Row Buttons:** Ghost/Tertiary buttons on Schedule items ("Mark Present").

## 6. UX Flow
1. User logs in.
2. Lands on Dashboard.
3. Views high-priority alerts (Unpaid fees, today's classes).
4. Clicks "Mark Attendance" directly from the Schedule widget -> Opens Attendance Modal -> Submits -> Returns to Dashboard with updated status.

## 7. Mobile Layout
- Stats Cards turn into a horizontal scrolling row (carousel) or stack 2x2.
- The 2-column middle section stacks vertically (Schedule first, then Pending Actions).
- Quick action buttons are converted to a floating action button (FAB) or prominent sticky buttons at the top.

## 8. Empty States
- If no students/batches exist: Show an engaging "Onboarding Card" centered on the screen with a friendly illustration and a big Primary Red button: "Add Your First Batch" and "Add Your First Student".

## 9. Success States
- Marking attendance from the dashboard triggers a Success Toast (`#2E7D32` background) in the bottom center: "Attendance marked successfully."

## 10. Error States
- If metrics fail to load: Show a "Retry Loading" ghost button inside the widget card instead of a full page crash.
