# Record Payment

**References:** Stripe (Checkout Manual entry), Zoho Invoice.

## 1. Layout
A clean, focused Modal or Slide-over Drawer triggered from the Fees table "Mark Paid" button.

## 2. Components
- **Student Banner:** Identifies who the payment belongs to ("Receiving payment from: Raghav Singh").
- **Inputs:** Amount Field (Large font), Mode of Payment Dropdown, Remarks.

## 3. Tables
N/A

## 4. Forms
- **Amount Received Text Input:** Pre-filled with the exact amount due to avoid typing unless partial payment.
- **Payment Mode Radio Cards:** Visual cards for `[💵 Cash]`, `[🏦 UPI]`, `[💳 Bank]`.

## 5. Buttons
Default "Cancel" (Ghost) on the left, "Confirm Payment" (Primary Solid Success-Green) on the right.

## 6. UX Flow
Student hands teacher cash -> Teacher opens app -> Dashboard Quick Actions -> Record Payment -> Selects Student -> Amount pre-fills -> Clicks Cash -> Clicks Confirm. Done.

## 7. Mobile Layout
A full-screen modal ensuring the numeric keyboard doesn't obscure the "Confirm" button. Make the Amount Field font distinctively larger (`24px`).

## 8. Empty States
N/A

## 9. Success States
"Payment of ₹1,500 recorded for Raghav Singh." accompanied by an option to "Share Digital Receipt on WhatsApp".

## 10. Error States
"Amount entered cannot be negative or zero." validate on blur.
