# Add Student

**References:** Google Forms (simplicity), Stripe (Checkout UI input mapping).

## 1. Layout
Rendered as either a Slide-over Drawer (Desktop) from the right edge, or a Full-Page form (Mobile) to maintain focus.

## 2. Components
- **Progress Stepper (Optional):** If heavily detailed (Personal Info -> Parent Info -> Fees).
- **Inputs:** Standard responsive text fields.

## 3. Tables
N/A

## 4. Forms
Groups fields clearly: "Student Details" vs "Parent Contact". Automatically formats phone fields using `(XXX) XXX-XXXX`.

## 5. Buttons
- **Sticky Footer:** "Cancel" (Ghost) on the left, "Add Student" (Primary Solid Red) on the right.

## 6. UX Flow
Fast data entry is assumed. Pressing Tab moves sequentially. After clicking Add Student, the drawer closes automatically, table refreshes, and success banner shows.

## 7. Mobile Layout
Keyboard management is critical. The "Next" button on iOS/Android keyboards handles form progression seamlessly.

## 8. Empty States
N/A

## 9. Success States
"Student Rahul added to Class 10 successfully!" (Green Toast).

## 10. Error States
"Phone number is already associated with an existing student." (Red highlight on the input box + validation text).
