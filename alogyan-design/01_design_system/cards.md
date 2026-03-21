# Cards

**References:** Notion (clean borders, white backgrounds), Zoho (dashboard widgets).

## 1. Layout
Cards form the basic container for almost all content. They sit on a `#F8F9FA` light background to pop out.

## 2. Components
- **Standard Card:** `#FFFFFF` background, `12px` border-radius, `1px solid #E0E0E0` border.
- **Elevated Card:** Stronger drop shadow for modals and hover states.

## 3. Tables
Tables are always embedded inside a Standard Card without an external border, relying on the card's border.

## 4. Forms
Forms are wrapped in Cards with a `24px` internal padding.

## 5. Buttons
Card footers often contain a right-aligned Secondary Button ("Cancel") and Primary Button ("Save").

## 6. UX Flow
Hovering over interactive cards (like "Batches") elevates the card (shadow increases from `md` to `lg`) to indicate clickability.

## 7. Mobile Layout
Cards lose their left/right external margins on small screens, stretching edge-to-edge, or maintain a standard `16px` margin.

## 8. Empty States
Empty cards have a dashed border instead of solid, with centered light-grey text and an icon.

## 9. Success States
"Active" or successfully completed cards gain a thin `<Success Green>` left-border highlight (`border-left: 4px solid #2E7D32`).

## 10. Error States
If a card fails to load its data widget, a subtle Warning Orange border appears with a "Retry" ghost button.
