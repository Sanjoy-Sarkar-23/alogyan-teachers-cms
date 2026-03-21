# Mobile Layout

**References:** WhatsApp Web/App (bottom navigation), Stripe Mobile App (vertically stacked cards).

## 1. Layout
Strict 1-column layout (`padding: 16px`). Navigation moves from the side array to a fixed Bottom Tab Bar.

## 2. Components
- **Bottom Nav Bar:** 4 to 5 icons (Home, Students, Batches, More). Active states colored `#D32F2F`.
- **Sliding Drawers:** Bottom-sheet components replace centered Modals.

## 3. Tables
Tables transmute into Card Lists. Each row becomes a visually distinct Card with data stacked left-to-right, top-to-bottom.

## 4. Forms
Inputs span 100% width. Numeric inputs invoke the phone's native numeric keypad.

## 5. Buttons
Primary CTAs are often 100% width and pinned to the very bottom of the screen above the safe area.

## 6. UX Flow
Swipe gestures are natively supported (swipe right to go back, swipe a list item left to reveal a "Delete" action).

## 7. Mobile Layout
(This document defines the mobile layout architecture globally).

## 8. Empty States
Illustrations are scaled down to 50% max height to ensure Text and the CTA button stay above the keyboard fold.

## 9. Success States
Toasts drop down from the top edge instead of the bottom to prevent overlapping the bottom navigation bar.

## 10. Error States
Validation messages must be extremely concise to prevent multi-line breaks on tiny 320px width screens.
