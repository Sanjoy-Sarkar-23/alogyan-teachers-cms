# Fees List

**References:** Stripe Dashboard (payment tracking ledgers).

## 1. Layout
A full-width robust data table occupying the main container space, dedicated to Pending or Collected fee ledgers.

## 2. Components
- **Search Omnibar:** "Search by Student Name or Invoice ID..."
- **Filter Chips:** "Status: Pending", "Status: Overdue", "Month: October".
- **Financial Badges:** Vibrant `Paid` (Green) and `Overdue` (Red).

## 3. Tables
- **Columns:** Invoice ID, Student Name, Batch, Due Date, Amount (Rs.), Status, Action.
- Right-align numeric columns for easier scanning.

## 4. Forms
N/A - Direct modification happens via `record_payment.md` or dedicated modals.

## 5. Buttons
"Generate Request" (Primary Red Header Button). Three-dots action per row ("Send Reminder", "Mark Paid").

## 6. UX Flow
Teacher wants to see who hasn't paid this month. Opens Fees -> Filters by "Pending" -> Clicks "Send Reminder" on the top 5 rows. WhatsApp links open.

## 7. Mobile Layout
Table transforms into financial Cards. Card Top Left: Student Name. Card Top Right: Amount Due. Bottom Right: "Mark Paid" button.

## 8. Empty States
"You have no pending fee requests! Every student is up to date."

## 9. Success States
Row disappears from "Pending" tab upon being marked paid, accompanied by a Success Toast.

## 10. Error States
"Failed to load invoice. Server timeout."
