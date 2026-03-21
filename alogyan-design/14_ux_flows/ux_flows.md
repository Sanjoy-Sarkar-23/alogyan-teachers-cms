# UX Flows & User Journeys

A centralized breakdown of the most critical flows in the Alogyan platform to ensure minimal clicks and cognitive load.

## 1. Onboarding Flow (Teacher)
- **Goal:** Get a new teacher from signup to creating their first batch as frictionless as possible.
- **Steps:**
  1. Signup (Phone + OTP or Google Auth).
  2. Setup Profile Wizard (Step 1: Name & Subject, Step 2: Location, Step 3: Logo/Photo).
  3. Dashboard lands on "Zero State" - Prompts Action -> "Create First Batch".
  4. Fill single-screen Batch Creation Modal.
  5. Prompt -> "Would you like to add students now?" -> Skip or Add.
- **Friction Reduction:** Do not force billing or complex settings setup during onboarding. Allow immediate usage.

## 2. Lead Generation Flow (Student to Teacher)
- **Goal:** Connect a browsing student to a specific teacher.
- **Steps:**
  1. Student searches Alogyan Discovery.
  2. Finds Teacher. Reviews profile.
  3. Clicks "Book Trial".
  4. Native Alogyan modal captures Name, Phone, and Class info.
  5. Student receives SMS: "Request sent".
  6. Teacher Dashboard updates with "New Lead Alert". Teacher clicks "Accept & Contact".
  7. Teacher uses integrated WhatsApp button to message student.

## 3. Invoice & Payment Flow
- **Goal:** Generate a fee request and mark it paid based on cash or digital payment.
- **Steps:**
  1. Teacher selects Batch -> "Generate Fee Request" -> Set Rs. 1500 for entire batch.
  2. Submits.
  3. Alogyan sends automated SMS/Email localized reminders with a payment link (if Razorpay/Stripe integrated) to parents.
  4. Parent clicks link -> Pays via UPI.
  5. Webhook updates Alogyan DB -> System automatically marks student as "Paid" (Green Badge).
  6. If paid via Cash: Teacher manually clicks "Mark Paid" -> Selects Cash -> DB updates.

## 4. Communication Broadcast Flow
- **Goal:** Teacher sends an emergency notification regarding a canceled class.
- **Steps:**
  1. Teacher click "📢 New Announcement" on header navigation.
  2. Selects "Class 10 Science" Batch from dropdown.
  3. Types "Class Canceled. Rescheduled to Sunday."
  4. Keeps default checked "Send Push & WhatsApp".
  5. Clicks Send.
  6. Parents' phones immediately buzz with the update.

## 5. Principle: Global Add Action
- No matter where the Teacher is in the app, a prominent `+` button in the top right header allows them to instantly trigger core actions (Add Student, Create Batch, New Fee Request, Upload Notes) via globally accessible Modals. This prevents unnecessary page navigation.
