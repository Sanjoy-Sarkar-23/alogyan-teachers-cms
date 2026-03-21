# Screen: Super Admin Panel

The Admin Panel is strictly for Alogyan internal staff to manage the platform, monitor subscriptions, handle support requests, and verify teacher profiles.

## 1. Layout
- **Type:** Heavy Data Dashboard (Internal CRM style).
- **Sidebar:** Left aligned. Modules: "Overview", "Tutors", "Students", "Subscriptions", "Support Tickets", "Settings".
- **Top Header:** Global internal search (find user by ID or Phone).

## 2. Components
- **KPI Metrics Cards:** "New Registrations Today", "MRR (Monthly Recurring Revenue)", "Active Support Tickets".
- **Action Verification Badges:** "Pending Verification" tables requiring manual approval of IDs or certificates.
- **User Detail Modal (God Mode):** A modal or slide-over that allows Alogyan staff to view a teacher's account details, billing history, and act on their behalf (if allowed/required for support).

## 3. Tables
- **Teacher Master Table:**
  - Columns: ID, Teacher Name, Phone, Registered Date, Plan (Free/Pro), Status (Active/Suspended/Pending Verif), Actions (Suspend, View CRM).
  - Density: Tight (to maximize data visibility). Include sorting and column toggles.

## 4. Forms
- **CRM Note Form:** For support staff to add internal notes to a teacher's file (e.g., "Called on Oct 10 regarding refund").
- **Broadcast System:** Form to send platform-wide announcements to all teachers.

## 5. Buttons
- **Critical Actions:** "Suspend Account" (Danger Red - Requires typed confirmation).
- **Secondary Actions:** "Approve Profile" (Success Green), "Sync Billing" (Secondary Outline).

## 6. UX Flow (Verifying a Teacher)
1. Admin logs in, clicks "Pending Verifications".
2. Sees a list of recently registered teachers.
3. Clicks on the first row. A side-drawer opens displaying the uploaded ID proof next to the provided Name/Details.
4. Admin compares data. 
5. Clicks "Approve" (Green Button).
6. Auto-loads the next teacher in the queue to maintain high workflow velocity.

## 7. Mobile Layout
- Internal admin panels are rarely used on mobile. While basic responsiveness is required, complex tables will require horizontal scrolling. Focus layout efforts primarily on Desktop (1080p+).

## 8. Empty States
- "No pending support tickets. Great job!"
- "No teachers require verification today."

## 9. Success States
- Toast: "Teacher profile Approved and platform visibility activated."
- Toast: "Refund processed via Stripe/Razorpay API."

## 10. Error States
- API Failures: "Failed to connect to Razorpay. Cannot verify billing status at this moment. Please retry."
