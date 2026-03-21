# Forms & Inputs

**References:** Stripe Dashboard (clean inputs, clear validation), WhatsApp Web (minimalist input areas).

## 1. Layout
Single column for mobile. Max 2 columns for desktop (using CSS Grid). Labels are stacked *above* inputs, never inline.

## 2. Components
- **Text Input:** `1px solid #E0E0E0`, `6px` radius, `16px` text size (prevents iOS auto-zoom).
- **Dropdown:** Standardized `<select>` replacement with an arrow icon.
- **Checkbox/Radio:** Custom branded elements using Primary Red for active state.

## 3. Tables
Inline form editing inside tables uses a condensed version of the text input (no label, `8px` padding).

## 4. Forms
All forms group related fields into Fieldsets. Required fields have a red asterisk `*`.

## 5. Buttons
Submit buttons are disabled and muted until all required fields pass front-end validation.

## 6. UX Flow
Pressing `Enter` automatically jumps to the next field. On the final field, `Enter` submits the form.

## 7. Mobile Layout
Touch targets for inputs are a minimum of `44px` tall. Keyboards trigger appropriate types (e.g., `type="number"` for phone).

## 8. Empty States
If a dropdown has no options (e.g., selecting a batch when none exist), it displays "No batches available" and provides an inline link to create one.

## 9. Success States
A green check icon (`✓`) appears inside the input field on the right edge when a complex field (like an email) is validated.

## 10. Error States
Inline validation messages appear below the input in Danger Red `#C62828` text, and the input border turns red.
