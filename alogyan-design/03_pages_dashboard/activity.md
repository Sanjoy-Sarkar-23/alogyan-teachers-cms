# Activity (Dashboard Component)

**References:** Stripe (history ledgers), Notion (recent changes block).

## 1. Layout
Displayed as a vertical scrollable list widget inside the Dashboard or Teacher Profile.

## 2. Components
Each item uses an "Icon-Text-Time" layout. For example, a small Green Avatar for "Present" followed by "Aarav Sharma marked present in Math."

## 3. Tables
A 1-column table or `<ul>` list representation without headers.

## 4. Forms
N/A

## 5. Buttons
"View All Activity" ghost button at the bottom of the list widget.

## 6. UX Flow
Allows a teacher to quickly scan if they forgot to do something. Clicking an activity item links directly to the relevant student or batch record.

## 7. Mobile Layout
Spans 100% width. Instead of a dedicated module, often placed below the Fold on the mobile dashboard.

## 8. Empty States
"No recent activity logged." with a sleepy clock illustration.

## 9. Success States
New activity pulses with a faint green background momentarily when pushing real-time updates (WebSockets).

## 10. Error States
"Failed to load activity feed" - Retry button.
