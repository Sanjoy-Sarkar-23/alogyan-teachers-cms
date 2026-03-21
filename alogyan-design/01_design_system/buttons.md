# Buttons

**References:** Google Classroom (flat primary colors), Stripe Dashboard (subtle shadows on hover).

## 1. Layout
Buttons are typically aligned to the right in forms and modals, or full-width on mobile layouts.

## 2. Components
- **Primary Button:** `#D32F2F` background, white text.
- **Secondary Button:** White background, `#E0E0E0` border, primary text.
- **Ghost Button:** Transparent background, colored text on hover.

## 3. Tables
N/A - Actions inside table rows use Small Ghost Buttons or Icon Buttons (e.g., three dots `...`).

## 4. Forms
Primary Submit button always pinned to the bottom right of the form.

## 5. Buttons
- All buttons use an 8px border radius.
- Padding: `12px 24px` for default, `8px 16px` for small.

## 6. UX Flow
Hovering over a button slightly darkens the background and increases the box-shadow (elevation). Clicking triggers a ripple effect or standard active state scale-down (`transform: scale(0.98)`).

## 7. Mobile Layout
Buttons stretch to `width: 100%` inside mobile forms and bottom sticky bars.

## 8. Empty States
Empty states contain a single, highly visible Primary Button to encourage the first action (e.g., "Add Student").

## 9. Success States
On click, the button can show a loading spinner, then transition to a Green Success Checkmark before routing.

## 10. Error States
If clicked while a form is invalid, the button briefly shakes (haptic/visual feedback).
