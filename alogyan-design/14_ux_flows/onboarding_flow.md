# Onboarding Flow (Teacher Registration)

**References:** Stripe Signup (clean and linear).

## 1. Layout
Centered minimal card layout. Absolute background `#F8F9FA`.

## 2. Components
- **Progress Stepper:** Dots or numbered circles (e.g., 1 of 3).
- **OTP Input:** 4 or 6 boxes specifically designed for digit entry. Auto-focusing.

## 3. Tables
N/A

## 4. Forms
- **Step 1:** Enter Phone Number.
- **Step 2:** Enter OTP.
- **Step 3:** Basic Details (First Name, Last Name, Primary Subject limit 1).
- **Step 4:** Finish (Direct to empty Dashboard state triggering creation hook). No payments asked upfront.

## 5. Buttons
"Send OTP", "Verify & Continue", "Finish Setup" (Large, Primary `#D32F2F` buttons spanning 100% width of the card).

## 6. UX Flow
User clicks `Sign Up` -> Types 10-digit number -> Receives SMS -> Auto-reads SMS (Android) or types OTP -> Types "Anjali, Maths" -> Lands on Dashboard. Takes < 30 seconds.

## 7. Mobile Layout
Ensure the keypad doesn't obscure the `Next` button on smaller screens by keeping form lengths incredibly short.

## 8. Empty States
N/A

## 9. Success States
"Profile created successfully!" fireworks SVG animation.

## 10. Error States
"Invalid OTP. Please try again or resend code." inline red validation.
