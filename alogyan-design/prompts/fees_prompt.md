# Prompt: Fees & Payments Module

**Context:** Build the Fees tracking ledger and payment forms (`/fees`).

**System Prompt Injection:**
`Read and apply the rules from master_prompt.md before proceeding.`
`Refer to 07_pages_fees/fees_list.md and record_payment.md for detailed specs.`

**Task:**
Generate a financial dashboard UI for tracking student fee payments.
1. **Summary Header:** Generate 3 KPI cards at the top: Collected this Month, Pending Overdue, Total Expected. Use Green/Red text respectively to highlight the fiscal status.
2. **Tabbed Navigation:** Implement standard tab navigation switching between "Pending", "Collected", and "Batches Pricing".
3. **Pending Fees Table:** Create a data table showing Student Name, Batch, Due Date, and Amount Due. Make sure Amount is right-aligned.
4. **Row Actions:** Add two primary row-level actions: "Send Reminder" (WhatsApp Icon) and "Mark Paid" (Ghost Button/Primary Text).
5. **Payment Modal:** Scaffold a popup Modal triggered by the "Mark Paid" button. It should contain a large Input field for the amount (pre-filled), and large visual toggle cards for the payment method `(💵 Cash, 🏦 UPI, 💳 Bank)`.
