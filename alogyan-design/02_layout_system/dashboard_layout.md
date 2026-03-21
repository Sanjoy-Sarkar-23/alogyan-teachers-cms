# Dashboard Layout

**References:** Zoho (modular widgets), Stripe (clean card grids layout).

## 1. Layout
A 12-column CSS Grid structure that places summary metrics at the top and split interactive cards (charts, lists) below.

## 2. Components
Cards are the primary structural element. The header is sticky, and the sidebar is fixed.

## 3. Tables
Dashboard tables use simplified, headerless "List Views" to show the top 5 urgent items.

## 4. Forms
Direct data entry forms are hidden behind quick action modals.

## 5. Buttons
Primary calls to action are floating buttons or pinned to card footers.

## 6. UX Flow
Upon entering the dashboard, the teacher immediately sees overdue items and clicks the "Resolve" button right on the card.

## 7. Mobile Layout
The grid collapses into a single vertical column. Sticky top actions enable immediate engagement without scrolling back up.

## 8. Empty States
A friendly illustration of an empty desk with a large primary button "Get Started with Alogyan".

## 9. Success States
Toast notifications ("Attendance marked") hover centrally over the dashboard without disrupting workflow.

## 10. Error States
If a specific widget (e.g., Revenue tracker) fails to fetch, only that card displays a warning skeleton loader with a manual "Retry" button.
