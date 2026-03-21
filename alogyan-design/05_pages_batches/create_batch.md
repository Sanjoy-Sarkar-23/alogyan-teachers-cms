# Create Batch

**References:** Google Calendar (event creation), Typeform (focused flow).

## 1. Layout
Modal (Dialog Box) overriding the current page context to ensure focus, or a slider-drawer.

## 2. Components
- **Input Fields:** Batch Name, Subject Dropdown.
- **Weekly Schedule Picker:** 7 circular toggle buttons representing M T W T F S S.
- **Time Picker:** Native start/end time.

## 3. Tables
N/A

## 4. Forms
Very small, concise form to prevent creation friction. Advanced settings (Capacity limit, fees) are initially hidden under "Advanced Options".

## 5. Buttons
"Create Batch" (Primary Red, right-aligned the footer). "Cancel" (Ghost, left-aligned).

## 6. UX Flow
Admin clicks `+ Create Batch` -> Types "Class 9 Weekend" -> Toggles S and S -> Picks 10 AM -> Hits Create -> Batch card instantly appears in Grid.

## 7. Mobile Layout
Weekly picker circles must be a minimum of `44px` in diameter to ensure touch-friendliness.

## 8. Empty States
N/A

## 9. Success States
Drawer slides out smoothly (ease-in-out), fading back to the list layout with a new element added dynamically.

## 10. Error States
"Batch name is required." (Danger Red tooltip if attempting to submit early).
