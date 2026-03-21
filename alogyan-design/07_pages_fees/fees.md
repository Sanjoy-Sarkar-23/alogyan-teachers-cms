# Screen: Fees

The Fees module handles the financial records: generating fee requests, tracking paid/unpaid students, and sending reminders.

## 1. Layout
- **Type:** Dashboard Style split view & Data List.
- **Top Section (Summary Cards):** Total Collected This Month, Pending Fees, Expected Revenue.
- **Main Section:** Tabbed View.
  - Tab 1: "Pending" (List of students who owe money).
  - Tab 2: "Collected" (History of payments).
  - Tab 3: "Fee Structures" (Managing base fees per batch).

## 2. Components
- **Tabs:** Standard underlined text tabs for switching contexts.
- **Action Menu (Three dots `...`):** On Pending student rows for "Mark Paid", "Send Reminder", "Edit Amount".
- **Financial Badges:** "Paid" (Green), "Overdue" (Red), "Pending" (Orange), "Partial" (Yellow/Orange).

## 3. Tables
- **Pending Fees Table:**
  - Columns: Student Name, Batch, Amount Due, Due Date, Status (Overdue/Pending), Actions (Mark Paid, Remind).
- **Collected Fees Table:**
  - Columns: Student/Receipt No, Amount Paid, Date Paid, Method (Cash/Online/UPI), Actions (Download Receipt).

## 4. Forms
- **"Mark Paid" Modal:**
  - Input: Amount Received (pre-filled with total due).
  - Dropdown: Payment Mode (Cash, UPI, Bank Transfer).
  - Optional Input: Remarks/Transaction ID.
- **"Create Fee Request / Invoice" Modal:**
  - Checkbox List: Select students or batches.
  - Input: Amount due.
  - Date Picker: Due date.
  - Input: Description (e.g., "September Tuition Fee").

## 5. Buttons
- **Global Actions:** "+ Generate Request" (Primary).
- **Row Actions:** "Mark Paid" (Success Green text/Ghost), "Send Reminder" (WhatsApp Icon Button - Primary Red text/Ghost).

## 6. UX Flow (Marking a Fee Paid)
1. Teacher sees "Pending Fees" on Dashboard. clicks "View All".
2. Lands on pending fees tab.
3. Finds the student who handed over cash, clicks "Mark Paid".
4. Confirms the amount and selects "Cash" in the modal.
5. Clicks "Submit". Modal closes, row moves to "Collected" tab. 
6. (Optional) Auto-sends a generic WhatsApp thank you/receipt message if enabled.

## 7. Mobile Layout
- Table rows become stacked Cards. 
- Pending Card Layout: 
  - Top: Name & Amount Due (Large Bold text).
  - Middle: Batch & Due Date.
  - Bottom: Two full-width buttons next to each other ("Send Reminder" | "Mark Paid").
- Summary metric cards become a horizontal swipeable carousel.

## 8. Empty States
- Pending Tab (No pending fees!): High-five illustration. "All clear! Every student has paid up for this month."
- Collected Tab (Start of month): "No payments collected yet this month."

## 9. Success States
- Toast: "Payment of ₹1,500 recorded for Aarav Sharma."
- Toast: "Reminder sent to 14 students."

## 10. Error States
- Form validation: "Amount received cannot exceed the due amount without updating the fee structure."
- Network error on reminder send: "Failed to send reminders. Please check your network connection."
