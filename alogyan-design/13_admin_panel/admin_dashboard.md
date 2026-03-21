# Admin Dashboard (Super Admin)

**References:** Stripe Radar (fraud/internal metrics), Retool (internal workflows).

## 1. Layout
Sidebar (Left) | Heavy Data Overview (Right). Highly compressed, information-dense grid layout.

## 2. Components
- **System Metrics:** Server Health, Total MRR, Daily Active Teachers (DAT), Daily Active Students (DAS).
- **Alert Queue:** "5 profiles need KYC verification", "3 Support tickets pending > 24hrs".

## 3. Tables
Used heavily. A massive, sortable `Users Data Grid` acting dynamically.

## 4. Forms
Admin controls: System wide broadcast modal (rich text form with urgency select: Info, Warn, Critical).

## 5. Buttons
System actions ("Run Payouts", "Suspend Bad Actor", Primary/Danger Red combinations).

## 6. UX Flow
Logs in -> Scans overall system health -> Clicks into "KYC Queue" to resolve manual bottlenecks -> Runs manual support workflows.

## 7. Mobile Layout
PWA or mobile fallback purely for checking MRR or urgent alerts. Complex tables overflow-x (horizontal scroll).

## 8. Empty States
"Zero pending tickets." (Celebratory icon).

## 9. Success States
"Profile verified successfully. Triggering welcome email."

## 10. Error States
"API gateway timeout while fetching Stripe payouts."
