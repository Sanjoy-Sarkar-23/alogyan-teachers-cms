# Booking Flow (Student Trial Enrollment)

**References:** Calendly (Date selection context), ClassPass (Booking).

## 1. Layout
A focused checkout-style modal overlay sitting atop the Teacher Profile.

## 2. Components
- **Time/Slot Picker:** Horizontal scrolling chip list showing available class hours based on the batch schedule.
- **Lead Capture Form:** Name, Grade, Phone inputs.

## 3. Tables
N/A

## 4. Forms
3-step stepper: Select Batch -> Pick Slot (if applicable) -> Give Detail.

## 5. Buttons
Default layout: Left (Back/Cancel), Right (Next Step / Confirm Booking).

## 6. UX Flow
Browsing Profile -> Clicks `Book Free Trial` -> Sees "Class 10 Physics" -> Clicks `Saturday 10 AM` -> Taps `Next` -> Enters Name/Phone -> Taps `Request` -> Done. Note: Minimal clicks.

## 7. Mobile Layout
Drawer slides up from bottom. Step 1 (Time Chips), Step 2 (Form Inputs) dynamically replaces content vertically rather than side-scrolling to maintain standard keyboard contexts.

## 8. Empty States
"No trial slots available this week."

## 9. Success States
Success Screen: "Awesome! Your request was sent. The teacher will reach out on WhatsApp." (Large green checkmark graphic).

## 10. Error States
"Slot already full." (If two people clicked simultaneously).
