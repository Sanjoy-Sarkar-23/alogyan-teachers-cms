# Fees Reports

**References:** Stripe (Analytics dashboards), Razorpay (Settlement reports).

## 1. Layout
Dashboard style widget view. Global month/year picker at the top.

## 2. Components
- **Revenue KPI Card:** "Total Collected This Month: ₹45,000".
- **Pending KPI Card:** "Total Pending: ₹12,000" (Red text).
- **Bar Chart:** Revenue comparison over the last 6 months.

## 3. Tables
Detailed "Export Ready" ledger table at the bottom tracking Month | Expected Revenue | Actual Collected | Delta.

## 4. Forms
Filters only. "Select Financial Year" dropdown.

## 5. Buttons
"Download CSV ledger" (Secondary Outline).

## 6. UX Flow
Admin needs to file taxes or check monthly growth -> Opens Fees Reports -> Sets range "Year to Date" -> Sees Bar Chart trending upwards -> Downloads CSV for accountant.

## 7. Mobile Layout
Charts must support horizontal scrolling natively.

## 8. Empty States
"No revenue data for this period."

## 9. Success States
"CSV downloaded to your device."

## 10. Error States
"Unable to generate report for selected timeframe."
