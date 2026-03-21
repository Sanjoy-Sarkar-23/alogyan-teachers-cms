# Payment Flow (Parent Paying Fees)

**References:** Razorpay Checkout (modal payment gateways), Stripe Checkout.

## 1. Layout
A responsive Payment Landing Page hosted securely on Alogyan. Teacher logo atop, Invoice details at the right, Payment Gateway integration at the bottom.

## 2. Components
- **Invoice Summary:** "Class 10 Fees • October 2026 • Teacher: Priya".
- **Amount Card:** Prominent visual display of `₹ 1,500`.

## 3. Tables
Line items grid: Tuition (₹1000) | Notes Material (₹500).

## 4. Forms
Payment option selection handled natively by Razorpay/Stripe SDK UI wrapper.

## 5. Buttons
"Pay ₹1,500 securely" (Primary Action linking to the SDK trigger).

## 6. UX Flow
Parent gets WhatsApp link -> Clicks Link -> Mobile Browser opens Payment Page -> Sees `₹1,500` -> Clicks Pay -> Unified Payment Interface (UPI) drawer opens native app (GPay/PhonePe) -> Auths -> Returns -> Success Confetti. Teacher is pinged instantly.

## 7. Mobile Layout
Crucial. 95% of parents will pay via Mobile. Ensure UPI deep-linking is flawless and no horizontal scrolling breaks the UX.

## 8. Empty States
If link expired: "This payment request has expired or was already marked paid."

## 9. Success States
"Payment Successful!" with Transaction ID and a button to "Download Receipt PDF".

## 10. Error States
"Bank server down. Please use another method." (Handled natively by Gateway SDK).
