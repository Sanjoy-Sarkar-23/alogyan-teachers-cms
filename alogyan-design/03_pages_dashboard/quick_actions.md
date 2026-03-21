# Quick Actions (Dashboard Component)

**References:** Razorpay Dashboard (Start action bar).

## 1. Layout
A horizontal row of prominent, distinct action buttons situated directly below the Dashboard greeting.

## 2. Components
- **Card-Buttons:** Square or rectangular buttons with an oversized icon, short title (e.g. `+ Add Student`), and a descriptive subtext (e.g. `Enroll a new pupil`).

## 3. Tables
N/A

## 4. Forms
These buttons are triggers that open large Modal Forms.

## 5. Buttons
Primary Red (`#D32F2F`) for the most frequent action (e.g., Attendance), Secondary Outlines for subsequent actions.

## 6. UX Flow
1. Teacher Logs In.
2. Needs to quickly record cash received. 
3. Clicks "Record Payment" via quick actions, bypassing the "Fees" tab entirely.
4. Transaction saved, returns instantly to Dashboard.

## 7. Mobile Layout
Stacks as a 2x2 grid of buttons, heavily utilizing icons over text to prevent clutter.

## 8. Empty States
N/A - Quick actions are inherently the answer to an empty state.

## 9. Success States
Action completes with a toast message.

## 10. Error States
If a user lacks permission, the button is greyed out (`#BDBDBD`) with a tooltip "Requires Premium Plan".
